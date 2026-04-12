---
layout: post
title: "纯GNU Bash环境安装Linux发行版"
date: 2026-04-11
categories: 技术
author: agppd
---

<h2><center><font color="red"> 此指南只适用于Linux </font></center></h2>

<h4><center><font color="red"> 新手建议直接按照ISO的引导去安装 </font></center></h4>

## 准备工作

你需要准备以下环境：

- **一个可用的Linux环境**（例如Live CD/USB启动后的终端）。本文假设你已经进入了这样一个环境，并且打开了一个 `bash`。
- **目标磁盘**（例如 `/dev/sda`、`/dev/nvme0n1`）。我们将在这块磁盘上安装新系统。
- **Linux发行版的映像文件**（比如 `ubuntu-22.04.iso`、`archlinux-2025.01.01-x86_64.iso`或任何你喜欢的发行版）。假设该文件位于 `/path/to/distro.iso`。

> 本文假定映像文件的内部包含一个**可复制的根文件系统**（例如Live系统中的 `squashfs`镜像，或者是一个直接的 `rootfs.tar`归档）。不同发行版的映像结构略有差异，但核心思路一致。

---

## 第一步：分区目标磁盘

使用 `fdisk`（或 `parted`）对磁盘进行分区。这里我们创建一个BIOS/MBR模式的简单分区方案（UEFI模式会在步骤5补充说明）。

```bash
# 以 /dev/sda 为例，请根据实际情况修改
sudo fdisk /dev/sda
```

在 `fdisk`交互界面中：

- 输入 `g` 创建新的GPT分区表（现代系统推荐），或 `o` 创建DOS分区表。
- 输入 `n` 新建分区，默认主分区，起始扇区默认，结束扇区可以输入 `+20G`（根分区大小）。
- 可选：再创建一个 `+2G` 的分区作为交换分区（类型改为 `82`）。
- 输入 `w` 写入并退出。

> 如果使用UEFI启动，还需要创建一个EFI系统分区（类型 `EFI System`，大小建议500MB，格式化为FAT32）。

---

## 第二步：格式化分区并挂载

```bash
# 格式化根分区（假设为 /dev/sda1）
sudo mkfs.ext4 /dev/sda1

# 如果有交换分区（假设为 /dev/sda2）
sudo mkswap /dev/sda2
sudo swapon /dev/sda2

# 挂载根分区到 /mnt
sudo mount /dev/sda1 /mnt

# 如果是UEFI系统，还需要：
# sudo mkfs.fat -F32 /dev/sdaX
# sudo mount /dev/sdaX /mnt/boot/efi
```

---

## 第三步：从映像中提取根文件系统

这一步取决于你手中的映像格式。下面列出最常见的两种情况。

### 情况A：映像中包含一个 `.squashfs`文件（如Ubuntu、Fedora Live）

大多数Live ISO会在 `/casper/`或 `/LiveOS/`目录下提供一个压缩的根文件系统镜像（例如 `filesystem.squashfs`）。我们需要挂载ISO，找到它，然后解压到目标分区。

```bash
# 创建挂载点并挂载ISO
sudo mkdir /mnt/iso
sudo mount -o loop /path/to/distro.iso /mnt/iso

# 查找 squashfs 文件（常见位置）
find /mnt/iso -name "*.squashfs"

# 假设找到 /mnt/iso/casper/ubuntu.squashfs
sudo unsquashfs -f -d /mnt /mnt/iso/casper/ubuntu.squashfs
```

### 情况B：映像是一个 `rootfs.tar`或 `rootfs.tar.xz`（如Alpine、Arch Linux基础镜像）

这类映像可以直接解压到目标分区：

```bash
sudo tar -xpf /path/to/rootfs.tar.xz -C /mnt
```

### 情况C：映像是一个可挂载的原始文件系统镜像（`.img`或 `.raw`）

```bash
# 通过循环设备挂载镜像
sudo losetup -f -P /path/to/image.img   # -P 加载分区
# 查看分配的设备名（如 /dev/loop0）
sudo lsblk
# 挂载镜像中的根分区（假设为loop0p1）
sudo mount /dev/loop0p1 /mnt
# 然后复制文件
sudo cp -a /mnt/* /target      # 注意目标分区要先挂载到 /target
```

**实际操作中**，最简单的方式是：**先挂载ISO，然后将其中的根文件系统（可能是 `squashfs`或一个完整的目录）复制到 `/mnt`**。如果你不确定，可以查看ISO内部的目录结构：

```bash
ls -l /mnt/iso
# 如果看到 bin, etc, home, usr 等目录，说明ISO本身就是可复制的根系统
# 那么直接复制即可：
sudo cp -a /mnt/iso/* /mnt/
```

---

## 第四步：进入新系统（chroot）

复制完文件后，我们需要进入新系统的环境来完成配置。

```bash
# 挂载必要的虚拟文件系统
sudo mount --bind /dev /mnt/dev
sudo mount --bind /proc /mnt/proc
sudo mount --bind /sys /mnt/sys

# 如果有UEFI，还要挂载efivarfs（可选）
# sudo mount --bind /sys/firmware/efi/efivars /mnt/sys/firmware/efi/efivars

# chroot 进入新系统
sudo chroot /mnt /bin/bash

# 设置一个可用的环境变量
export PATH=/usr/bin:/bin:/usr/sbin:/sbin
```

现在你已经在新系统的“内部”了。

---

## 第五步：基础系统配置

### 1. 设置root密码

```bash
passwd
```

### 2. 创建 `/etc/fstab`

根据你的分区情况，手动编写挂载配置。使用 `blkid`获取分区的UUID（推荐使用UUID代替设备名）。

```bash
blkid | grep /dev/sda
```

编辑 `/etc/fstab`：

```bash
cat > /etc/fstab << "EOF"
# <设备UUID>  <挂载点>  <文件系统>  <选项>       <dump> <pass>
UUID=xxx-xxx-xxx /         ext4    defaults,noatime 0 1
UUID=yyy-yyy-yyy swap      swap    defaults         0 0
# 如果是UEFI，还要添加EFI分区
UUID=zzz-zzz-zzz /boot/efi vfat    defaults         0 2
EOF
```

### 3. 设置主机名

```bash
echo "mynewlinux" > /etc/hostname
```

### 4. 配置网络（以静态IP或DHCP为例）

对于大多数使用 `systemd-networkd`或 `NetworkManager`的发行版，可以临时启用DHCP：

```bash
# 如果使用 systemd-networkd
cat > /etc/systemd/network/20-dhcp.network << "EOF"
[Match]
Name=en*

[Network]
DHCP=yes
EOF

systemctl enable systemd-networkd
```

或者直接编写 `/etc/network/interfaces`（Debian风格）。按你的发行版习惯来。

### 5. 配置时区和键盘映射

```bash
# 例如设置为上海时区
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 键盘映射（可选）
echo "KEYMAP=us" > /etc/vconsole.conf
```

---

## 第六步：安装引导程序（GRUB）

这是最关键的一步。根据启动模式（BIOS或UEFI）选择命令。

### 对于BIOS/Legacy模式：

```bash
# 在chroot中执行
grub-install /dev/sda           # 注意是磁盘，不是分区
grub-mkconfig -o /boot/grub/grub.cfg
```

### 对于UEFI模式：

```bash
# 确保 /boot/efi 已经挂载
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg
```

> 如果提示找不到 `grub-install`，说明你复制的新系统中没有安装GRUB包。你需要回到原始的Live环境，用 `chroot`后运行包管理器安装（例如 `apt install grub-pc`或 `pacman -S grub`）。这正是纯手动安装的“痛点”——你必须确保基础系统至少包含了 `grub`和 `linux`内核。

### 手动生成内核引导项（如果 `grub-mkconfig`失败）

有时 `grub-mkconfig`无法自动检测内核，你可以手动写一个简单的 `grub.cfg`：

```bash
cat > /boot/grub/grub.cfg << "EOF"
set default=0
set timeout=5

menuentry "My Linux" {
    linux /boot/vmlinuz-linux root=/dev/sda1 rw
    initrd /boot/initramfs-linux.img
}
EOF
```

（请根据实际的内核文件名和分区号修改）

---

## 第七步：收尾与重启

退出chroot并卸载所有挂载点：

```bash
exit   # 退出 chroot
sudo umount -R /mnt
sudo swapoff /dev/sda2   # 如果有交换分区
```

移除Live介质，然后重启：

```bash
sudo reboot
```

如果一切顺利，你会看到新系统的引导菜单，并顺利进入登录提示符（tty）。

## 常见问题与排错

| 问题                        | 可能的原因                                    | 解决方法                                                                                                          |
| --------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 启动后卡在 `grub rescue>` | GRUB未正确安装或找不到分区                    | 用Live环境重新chroot，执行 `grub-install` 并检查 `/boot` 是否有内核文件                                       |
| 内核恐慌 (kernel panic)     | `root=` 参数指定的设备不对，或缺少initramfs | 检查fstab和grub.cfg中的UUID/设备名，重新生成initramfs（如 `mkinitcpio -P` 或 `update-initramfs -u`）          |
| 网络无法使用                | 未配置网络服务或缺少驱动                      | 在chroot中安装对应网卡驱动，启用DHCP客户端                                                                        |
| 映像中没有可复制的根目录    | 该ISO是安装器而非Live系统                     | 换用官方提供的“Live镜像”或“基础系统镜像”。例如Debian有 `debian-live-xx.iso`，Arch有 `archlinux-bootstrap` |
