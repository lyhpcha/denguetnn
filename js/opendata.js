//取得政府opendata的資料（登革熱確診資料）
        function OpenData() {
            this.q = "" ;
            this.resourceID;
            this.url;
            this.limit = 1000;
            this.ajaxTimeout = 15000 ; //預設15秒
            this.data ;
            this.ajaxErr = " ";
            this.ajax = function() {
                var status = true;
                var query = "resource_id=" + this.resourceID;
                if ( !this.resourceID || this.resourceID == null) {
                    status = false;
                    OpenData.ajaxErr = 'resourceID is undefined or null' ;
                } else {
                    if ( this.q || this.q != null ) {
                        query = query + "&q=" + this.q ;
                        status = true;
                    }
                    if ( this.limit || this.limit != null ) {
                        query = query + "&limit=" + this.limit ;
                        status = true;
                    }
                }
                
                if ( status == true ) {
                    $.ajax({
                        url: this.url,
                        data: query,
                        timeout:this.ajaxTimeout,  //指定時間無回應 即為error
                        async:false,  //啟用同步，在ajax取資料過程中，ajax外的程式碼無法執行
                        error: function(err) {
                            status = false;
                            OpenData.ajaxErr = 'ajax error: ' + err;
                        },
                        success: function(data) {
                            OpenData.data = data;
                            status=true;
                        }            
                    });
                }
                return this.status;
            }                
        } //End _OpenData       