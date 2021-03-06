<aside>
ð¡ #59 ã§ä½æããVPCãä½¿ç¨

</aside>

## ããããã® AZ ã®ãã©ãã¼ããµããããã« EC2 ã¤ã³ã¹ã¿ã³ã¹ãæ§ç¯ãã¦ Nginx ãå°å¥ï¼å®äºï¼

- [x] [public] EC2 ã¤ã³ã¹ã¿ã³ã¹ãä½æ
  - [x] ãããªãã¯ IP ãæå¹å
  - [x] ç¾æç¹ã§ã»ã­ã¥ãªãã£ã°ã«ã¼ãã®ã¤ã³ãã¦ã³ãã«ã¼ã«ã¯ãã¤ IP ããã® SSH æ¥ç¶ã®ã¿è¨±å¯
- [x] [private] EC2 ã¤ã³ã¹ã¿ã³ã¹ãä½æ
  - [x] ãããªãã¯ IP ãç¡å¹å
  - [x] ç¾æç¹ã§ã»ã­ã¥ãªãã£ã°ã«ã¼ãã®ã¤ã³ãã¦ã³ãã«ã¼ã«ã¯ public ãµã¼ãã¼ã®ãã©ã¤ãã¼ã IP ããã® SSH æ¥ç¶ã®ã¿è¨±å¯
- [x] å¤æ®µ SSH ãã§ããããã«è¨­å®

  **è¨­å®ãã¡ã¤ã«**

  ```
  # .ssh/config

  Host praha-public
    HostName 13.230.224.119
    Port 22
    User ec2-user
    IdentityFile ~/aws/public.cer

  Host praha-private
    HostName 10.0.2.122
    Port 22
    User ec2-user
    ProxyCommand ssh praha-public -W %h:%p
    IdentityFile ~/aws/private.cer
  ```

  **ã­ã¼ã«ã«ãã private ãµããããã¸æ¥ç¶ OK**

  ```bash
  â¯ ssh praha-private
  Last login: Tue Jul 19 12:09:09 2022 from 10.0.1.233

         __|  __|_  )
         _|  (     /   Amazon Linux 2 AMI
        ___|\___|___|

  https://aws.amazon.com/amazon-linux-2/
  [ec2-user@ip-10-0-2-122 ~]$
  ```

  [è¸ã¿å°ãµã¼ãçµç±ã®å¤æ®µ SSH æ¥ç¶ãã­ã¼ã«ã«ç«¯æ«ã®ç§å¯éµã®ã¿ã§å®æ½ãã | DevelopersIO](https://dev.classmethod.jp/articles/bastion-multi-stage-ssh-only-local-pem/)

- [x] NAT ã²ã¼ãã¦ã§ã¤ãè¿½å 

    <aside>
    ð¡ NAT ã²ã¼ãã¦ã§ã¤ã¯ãElastic IP ã¢ãã¬ã¹ãéä¿¡å IP ã¢ãã¬ã¹ã¨ãã¦ä½¿ç¨ããã¤ã³ã¿ã¼ãããã²ã¼ãã¦ã§ã¤ã«ãã©ãã£ãã¯ãéä¿¡ãã¾ãã

    </aside>

  - [x] public ãµããããã« NAT ã²ã¼ãã¦ã§ã¤ãä½æ

    [NAT ã²ã¼ãã¦ã§ã¤](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html#nat-gateway-creating)

  - [x] private ãµããããã®ã«ã¼ããã¼ãã«ã«ã0.0.0.0/0 ã NAT ã²ã¼ãã¦ã§ã¤ã«åããé¢é£ä»ããè¿½å 

    [NAT ã²ã¼ãã¦ã§ã¤ã®ã¦ã¼ã¹ã±ã¼ã¹](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/nat-gateway-scenarios.html#public-nat-gateway-routing)

  - [x] ãã©ã¤ãã¼ããµããããããã®ã¤ã³ã¿ã¼ãããæ¥ç¶ããã¹ãï¼OKï¼

    ```bash
    [ec2-user@ip-10-0-2-122 ~]$ ping -c 1 google.com
    PING google.com (216.58.220.142) 56(84) bytes of data.
    64 bytes from nrt20s17-in-f14.1e100.net (216.58.220.142): icmp_seq=1 ttl=101 time=4.06 ms

    --- google.com ping statistics ---
    1 packets transmitted, 1 received, 0% packet loss, time 0ms
    rtt min/avg/max/mdev = 4.062/4.062/4.062/0.000 ms
    [ec2-user@ip-10-0-2-122 ~]$
    ```

    [NAT ã²ã¼ãã¦ã§ã¤ã®ã¦ã¼ã¹ã±ã¼ã¹](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/nat-gateway-scenarios.html#test-internet-connection)

- [x] Nginx ãå°å¥

  - [x] ã¤ã³ã¹ãã¼ã«ï¼ï¼

    ```bash
    # æ®éã«ãã£ããæ¨©éä¸è¶³ã§æããã
    [ec2-user@ip-10-0-2-122 ~]$ amazon-linux-extras install nginx1
    You lack permissions to write to system configuration.  /etc/yum.repos.d/amzn2-extras.repo

    # ãªãã³ã¸ï¼æåï¼
    [ec2-user@ip-10-0-2-122 ~]$ sudo amazon-linux-extras install nginx1
    Installing nginx
    # çç¥...
    [ec2-user@ip-10-0-2-122 ~]$ nginx -v
    nginx version: nginx/1.20.0
    ```

    - `amazon-linux-extras` ã£ã¦ä½ï¼

      - Amazon Linux 2 ã«ã¯ `Extras Library` ã¨ããããã±ã¼ã¸ç¾¤ãå­å¨ãã
      - `amazon-linux-extras` ã³ãã³ãçµç±ã§ãããã®ããã±ã¼ã¸ãç®¡çãã

        - ã³ãã³ãã¯ 4 ã¤ã ãï¼

          | help    | ã³ãã³ãä¸è¦§ãè¡¨ç¤ºãã             |
          | ------- | ---------------------------------- |
          | info    | ç¹å®ã®ããã±ã¼ã¸ã®è©³ç´°ãè¡¨ç¤ºãã   |
          | install | ããã±ã¼ã¸ãã¤ã³ã¹ãã¼ã«ãã       |
          | list    | å©ç¨å¯è½ãªããã±ã¼ã¸ä¸è¦§ãè¡¨ç¤ºãã |

  - [x] èµ·å

    ```bash
    # èµ·å
    [ec2-user@ip-10-0-2-122 ~]$ sudo systemctl start nginx.service

    # ã¹ãã¼ã¿ã¹ç¢ºèª
    [ec2-user@ip-10-0-2-122 ~]$ systemctl status nginx
    â nginx.service - The nginx HTTP and reverse proxy server
       Loaded: loaded (/usr/lib/systemd/system/nginx.service; disabled; vendor preset: disabled)
       Active: active (running) since ç« 2022-07-19 13:27:52 UTC; 10s ago
      Process: 392 ExecStart=/usr/sbin/nginx (code=exited, status=0/SUCCESS)
      Process: 388 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=0/SUCCESS)
      Process: 387 ExecStartPre=/usr/bin/rm -f /run/nginx.pid (code=exited, status=0/SUCCESS)
     Main PID: 394 (nginx)
       CGroup: /system.slice/nginx.service
               ââ394 nginx: master process /usr/sbin/nginx
               ââ395 nginx: worker process

     7æ 19 13:27:52 ip-10-0-2-122.ap-northeast-1.compute.internal systemd[1]: Starting The nginx HTTP and reverse proxy server...
     7æ 19 13:27:52 ip-10-0-2-122.ap-northeast-1.compute.internal nginx[388]: nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
     7æ 19 13:27:52 ip-10-0-2-122.ap-northeast-1.compute.internal nginx[388]: nginx: configuration file /etc/nginx/nginx.conf test is successful
     7æ 19 13:27:52 ip-10-0-2-122.ap-northeast-1.compute.internal systemd[1]: Started The nginx HTTP and reverse proxy server.
    [ec2-user@ip-10-0-2-122 ~]$
    ```

    [AWS CLI ã§ EC2 ãç«ã¦ã¦ Nginx ãèµ·åãã](https://zenn.dev/harasho/articles/5b715500de4c81c83042#nginx%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%97%E3%81%A6%E8%B5%B7%E5%8B%95%E3%81%99%E3%82%8B)

- [x] ä¸è¨æé ãããä¸åº¦å®è¡ãã¦ãã«ã AZ å±é

## ããããã® EC2 ã¤ã³ã¹ã¿ã³ã¹ããå¥ãã® HTML ãã¼ã¸ãè¿ã

```bash
# ï¼AZãã¨ã«ï¼å¬éãã£ã¬ã¯ããªã«HTMLãã¼ã¸ãä½æ
[ec2-user@ip-10-0-2-122 ~]$ cd /usr/share/nginx/html
[ec2-user@ip-10-0-2-122 html]$ sudo mkdir web
[ec2-user@ip-10-0-2-122 html]$ cd web
[ec2-user@ip-10-0-2-122 web]$ sudo touch index.html
[ec2-user@ip-10-0-2-122 web]$ sudo vim index.html
```

## ALBï¼ã¢ããªã±ã¼ã·ã§ã³ã­ã¼ããã©ã³ãµã¼ï¼ãè¨­ç½®ãã¦ãALB çµç±ã§ãã¼ã¸ã«ã¢ã¯ã»ã¹

> *ã­ã¼ããã©ã³ãµã¼*ã¯ãã¯ã©ã¤ã¢ã³ãã«ã¨ã£ã¦åä¸ã®éä¿¡åã¨ãã¦æ©è½ãã¾ãããã®ã­ã¼ããã©ã³ãµã¼ã¯ãåä¿¡ã¢ããªã±ã¼ã·ã§ã³ãã©ãã£ãã¯ãè¤æ°ã®ã¢ãã¤ã©ããªãã£ã¼ã¾ã¼ã³ã®è¤æ°ã®ã¿ã¼ã²ãã(EC2 ã¤ã³ã¹ã¿ã³ã¹ãªã©) ã«åæ£ãã¾ããããã«ãããã¢ããªã±ã¼ã·ã§ã³ã®å¯ç¨æ§ãåä¸ãã¾ãã

**ã»ã­ã¥ãªãã£ã¼ã°ã«ã¼ãã®è¨­å®**

- [x] ALB ç¨ã«ã`Alb-sg`ãè¿½å  â¨ HTTP éä¿¡ãå¨è¨±å¯
- [x] ãã©ã¤ãã¼ããµããããç¨ã®ã`Web-private-sg`ããç·¨é â¨ HTTP éä¿¡ã¯ `Alb-sg` ããã®ã¿è¨±å¯
- [x] ã¿ã¼ã²ããã°ã«ã¼ãã®ä½æ
- [x] ALB ã®ä½æ
  - [x] ã»ã­ã¥ãªãã£ã°ã«ã¼ã `Alb-sg` ãã¢ã¿ãã
  - [x] æ¥ç¶ãã¹ã

[Application Load Balancer ã®éå§æ¹æ³](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/application-load-balancer-getting-started.html#test-load-balancer)

## ãã¼ã¸ãåãæ¿ãããã¨ãç¢ºèª

![alb-test.gif](./assets/alb-test.gif)

## çæ¹ã® EC2 ã¤ã³ã¹ã¿ã³ã¹ãåæ­¢ããã¨åãæ¿ãããªããªããã¨ãç¢ºèª

![alb-test-2.gif](./assets/alb-test-2.gif)
