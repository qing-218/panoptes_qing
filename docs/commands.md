## ADB shell command reference

**Get main app activity**

```shell
cmd package resolve-activity -c android.intent.category.LAUNCHER PACKAGE
```

**Get focused activity**

```shell
dumpsys window | grep -E 'mCurrentFocus'
```

**Get package user id**

```shell
dumpsys package PACKAGE | grep userId= 
```

**Get devtools sockets**

```shell
cat /proc/net/unix | grep -a 'devtools_remote'
```

**Create new page**

```shell
am start -a android.intent.action.VIEW -d "URL" PACKAGE
```

**Get apk path**

```shell
pm path PACKAGE
```