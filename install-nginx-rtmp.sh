#!/bin/bash

# 📂 Define where to install
INSTALL_DIR=$HOME/nginx-rtmp

echo "📦 Creating installation directory at $INSTALL_DIR"
mkdir -p $INSTALL_DIR && cd $INSTALL_DIR

# 🧱 Install dependencies
if command -v brew &>/dev/null; then
    brew install openssl pcre2 zlib
else
    sudo apt update && sudo apt install -y libpcre3 libpcre3-dev libssl-dev zlib1g zlib1g-dev build-essential curl git
fi

# 📥 Download NGINX and RTMP module
curl -O http://nginx.org/download/nginx-1.25.4.tar.gz
tar -zxvf nginx-1.25.4.tar.gz
git clone https://github.com/arut/nginx-rtmp-module.git

# ⚙️ Configure NGINX with RTMP support
cd nginx-1.25.4
./configure \
  --prefix=$INSTALL_DIR/build \
  --with-http_ssl_module \
  --add-module=../nginx-rtmp-module

# 🔨 Build and install
make -j$(nproc || sysctl -n hw.ncpu)
make install

# 📝 Configure nginx.conf
CONF_PATH=$INSTALL_DIR/build/conf/nginx.conf
cat > $CONF_PATH <<EOF
worker_processes  1;
events { worker_connections  1024; }

rtmp {
    server {
        listen 1935;
        chunk_size 4096;

        application live {
            live on;
            record off;

            hls on;
            hls_path /tmp/hls;
            hls_fragment 1s;
            hls_playlist_length 3s;
        }
    }
}

http {
    server {
        listen 8080;

        location / {
            root /tmp/hls;
        }

        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /tmp;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin *;
        }
    }
}
EOF

# 🚀 Start NGINX
$INSTALL_DIR/build/sbin/nginx -p $INSTALL_DIR/build/

echo "✅ NGINX RTMP server running!"
echo "🎥 Send RTMP to: rtmp://<your-laptop-ip>:1935/live/stream"
echo "📺 View HLS at: http://<your-laptop-ip>:8080/hls/stream.m3u8"
