var count = 0;
function TVjsApi() {
    this.widgets = null,
    this.datafeeds = null,
    this.symbol = null,
    this.interval = null,
    this.precision = null,
    this.cacheData = {},
    this.lastTime = null,
    this.getBarTimer = null,
    this.isLoading = true,
    this.lang = 'en',
    this.isClicked = false,
    this.isFirst = true;
}
TVjsApi.prototype.switch_market = function(symbol){
    this.symbol = symbol
    this.isLoading = true
    this.widgets && this.widgets.setSymbol(this.symbol, this.interval)
}
TVjsApi.prototype.switch_language = function(lang){
    this.lang = lang
    this.widgets && this.widgets.setLanguage(this.lang)
}
TVjsApi.prototype.getPeriod = function(resolution) {
    var period = ''
    switch (resolution) {
    case '1':
        period = '1m'
        break
    case '3':
        period = '3m'
        break
    case '5':
        period = '5m'
        break
    case '15':
        period = '15m'
        break
    case '30':
        period = '30m'
        break
    case '60':
        period = '1h'
        break
    case '120':
        period = '2h'
        break
    case '240':
        period = '4h'
        break
    case '360':
        period = '6h'
        break
    case '720':
        period = '12h'
        break
    case '1D':
        period = '1d'
        break
    case '1W':
        period = '1w'
        break
    }
    return period
}
TVjsApi.prototype.init = function() {
    //设置默认symbol，interval的默认值
    var upColor = '#F43148', downColor = '#01C89F'
    var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ETHBTC'
    var interval = arguments.length > 0 && arguments[1] !== undefined ? arguments[1] : '720'
    var precision = arguments.length > 0 && arguments[2] !== undefined ? arguments[2] : 5 
    var lang = arguments.length > 0 && arguments[3] !== undefined ? arguments[3] : 'en' 
    this.symbol = symbol
    this.interval = interval
    this.precision = precision
    this.lang = lang

    this.datafeeds = new datafeeds(this)

    if (!this.widgets) {
        this.widgets = window.tvWidget = new TradingView.widget({
            //默认商品设置
            symbol: symbol,
            //默认请求间隔
            interval: interval,
            //默认是否全屏
            // fullscreen: false,
            //默认是否自适应
            autosize: true,
            theme: 'Dark',
            //设置容器
            container_id: 'trade-view',
            datafeed: this.datafeeds,
            library_path: './charting_library/',
            enabled_features: ["hide_left_toolbar_by_default","move_logo_to_main_pane"],
            disabled_features: [
            "header_symbol_search",
            "header_screenshot",
            "header_undo_redo",
            "header_compare",
            "legend_context_menu",
            "create_volume_indicator_by_default",
            "timeframes_toolbar",
            "pane_context_menu",
            "use_localstorage_for_settings",
            "show_hide_button_in_legend",
            "property_pages",
            ],
            charts_storage_api_version: "1.1",
            timezone: 'Asia/Shanghai',
            locale: this.lang,
            debug: false,
            preset: "mobile",
            overrides: {
                "paneProperties.background": "#0e1a28",
                "paneProperties.vertGridProperties.color": "#1c2a40",
                "paneProperties.horzGridProperties.color": "#1c2a40",
                'scalesProperties.fontSize': 12,
                "scalesProperties.lineColor": "#1c2a40",
                "scalesProperties.textColor":"#6C6F8B",
                //    K线图样式
                "mainSeriesProperties.candleStyle.upColor": upColor,
                "mainSeriesProperties.candleStyle.downColor": downColor,
                "mainSeriesProperties.candleStyle.borderColor": downColor,
                "mainSeriesProperties.candleStyle.borderUpColor": upColor,
                "mainSeriesProperties.candleStyle.borderDownColor": downColor,
                "mainSeriesProperties.candleStyle.wickUpColor": upColor,
                "mainSeriesProperties.candleStyle.wickDownColor": downColor
            },
            studies_overrides: {
                "volume.volume.color.0": downColor,
                "volume.volume.color.1": upColor,
                // "volume.volume ma.color": "rgba(136,136,136,0)",
                // "volume.volume ma.show": false
            }
        })

        var widgets = this.widgets;
        var self = this
        widgets.onChartReady(function() {
            //设置均线种类 均线样式
            // widgets.chart().createStudy('Moving Average', false, false, [5], null, {
            //     'Plot.color': 'rgb(255, 255, 255)',
            //     'precision': precision
            // });
            // widgets.chart().createStudy('Moving Average', false, false, [10], null, {
            //     'Plot.color': 'rgb(255, 213, 0)',
            //     'precision': precision
            // });
            // widgets.chart().createStudy('Moving Average', false, false, [20], null, {
            //     'Plot.color': 'rgb(255, 0, 191)',
            //     'precision': precision
            // });
            widgets.chart().createStudy('Volume', false, true, [20], null, {'Volume ma.color':'rgba(136,136,136,0)'});
            widgets.subscribe('mouse_down', function(e){
                var tar = document.querySelector('iframe').contentWindow.document.querySelector('.pane-legend-item-value-container')
                document.querySelector('#price').innerHTML = tar.innerHTML
                self.isClicked = true
                window.VM.active = ''
            });
            window.VM.setMA(true)

        })
    }
}
TVjsApi.prototype.sendMessage = function() {
    var self = this
    self.isLoading = true
    window.VM.getKlineData(function(){
        let _opt = {
            event: 'addChannel',
            channel:'kline',
            symbol: self.symbol,
            period:self.getPeriod(self.interval),
            api_token:'',
            subscribe:['kline'],
            isZip:false
        }
        socket.send(_opt)
    })
}
TVjsApi.prototype.onMessage = function(data) {
    count++;
    if (count < 5) {
        console.log("这是后台返回的数据" + count + "：" + JSON.stringify(data.length))
    }
    
    if (data && data.length) {
        var list = []
        var ticker = this.symbol + "-" + this.interval;
        var self = this;
        data.forEach(function(element) {
            list.push({
                time: Number(element[0]),
                open: Number(element[1]),
                high: Number(element[2]),
                low: Number(element[3]),
                close: Number(element[4]),
                volume: Number(element[5])
            })
        }, self)
        this.cacheData[ticker] = list
    }
    this.datafeeds.barsUpdater.updateData()
}
TVjsApi.prototype.getBars = function(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
    // console.log(' >> :', rangeStartDate, rangeEndDate)
    if (this.interval !== resolution) {
        this.interval = resolution
        this.sendMessage()
    }

    var ticker = this.symbol + "-" + this.interval
    if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        this.isLoading = false
        setTimeout(function(){
            window.setLoadStatus && window.setLoadStatus.postMessage(true)
        },1000)
        if(this.isFirst || (!this.isFirst && !this.isClicked)){ //第一次获取数据成功或没有点击的情况下，获取开高低收
            var self = this
            setTimeout(function(){
                var tar = document.querySelector('iframe').contentWindow.document.querySelector('.pane-legend-item-value-container')
                document.querySelector('#price').innerHTML = tar.innerHTML
                self.isFirst = false
            },100)
        }
        var newBars = []
        this.cacheData[ticker].forEach(item =>{
            if (item.time >= rangeStartDate * 1000 && item.time <= rangeEndDate * 1000) {
                newBars.push(item)
            }
        })
        onLoadedCallback(newBars)
    } else {
        var self = this
        this.getBarTimer = setTimeout(function() {
            self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        },
        10)
    }
}
