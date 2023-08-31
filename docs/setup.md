## Setup

### Android Device

1. Install a [userdebug build](https://source.android.com/docs/setup/create/new-device#build-variants) of android (
   tested on Lineage OS 18.1). If you are using an [AVD](https://developer.android.com/studio/run/managing-avds), this
   means selecting an image that ends in '(Google APIs)'

2. Install [Magisk](https://topjohnwu.github.io/Magisk/install.html). If you are using an AVD, you can
   use [rootAVD](https://github.com/newbit1/rootAVD) for this task

   Note: During the rest of the setup, there will be some superuser requests pop-ups. Please tap grant on them all

3. Install and launch [Linux Deploy](https://github.com/meefik/linuxdeploy/releases/tag/2.6.0)
    1. Click on the settings icon on the bottom right
    2. Set the distribution to debian
    3. Set the distribution suite to buster
    4. Set the image size to at least 8 GB
    5. Set the username to 'root'
    6. Set a password you can remember
    7. Enable the init system
    8. Enable the ssh server
    9. Exit the settings dialog
    10. Tap on the three dots on the top right, and select 'Install'
    11. Wait for the installation to finish
    12. Press the start button on the bottom left
    13. Enable autostart (optional). If you don't, you will have to repeat step 12 after every device restart.
        1. Open the hamburger menu on the top left
        2. Select 'Settings'
        3. Check 'Autostart'

### Linux PC

1. Install [node](https://nodejs.org/download/release/v19.1.0/) version 19.1.0. You can
   use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to do so.
2. Connect the device to your computer with a USB cable
3. Visit the [Frida releases](https://github.com/frida/frida/releases/tag/16.0.18) page and find a file named '
   frida-server-16.0.18-android-*ARCH*.xz', where ARCH is your android device's CPU architecture.
   Download, extract it, and rename the extracted file to 'frida-server'. You will need it later
4. Ensure that TCP ports 3000 to 3003, and 3100 to 3109, are free
5. Clone this repository
6. Open a terminal in the project's root directory (the one that contains a file called 'package.json')
    1. Generate an ssh key by running `ssh-keygen`, if you haven't already
    2. Run `npm i` to install all dependencies
    3. Run `adb devices` and ensure your device is in the list. If a pop-up appears on your android device
       about USB Debugging,
       tap OK. If there are other devices in the list, please disconnect them.
    4. Run `adb push FRIDA_SERVER_BIN /data/local/tmp`, where FRIDA_SERVER_BIN is the path of the 'frida-server' file
       you downloaded and renamed in step 3
    5. Run `./scripts/setup-container.sh` to build and install Python 3.10.10 and rsync on the debian
       container (this will take a while)
   
