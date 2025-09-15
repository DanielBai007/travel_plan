// 高德地图集成脚本
class AmapIntegration {
    constructor() {
        this.map = null;
        this.markers = [];
        this.routeLines = [];
        this.initAmap();
    }

    // 初始化高德地图
    async initAmap() {
        try {
            // 动态加载高德地图API
            await this.loadAmapScript();
            this.setupMapContainers();
        } catch (error) {
            console.warn('高德地图加载失败，使用备用地图方案', error);
            this.fallbackToLeaflet();
        }
    }

    // 加载高德地图脚本
    loadAmapScript() {
        return new Promise((resolve, reject) => {
            if (window.AMap) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&plugin=AMap.Driving,AMap.Geocoder';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load AMap'));
            document.head.appendChild(script);
        });
    }

    // 设置地图容器
    setupMapContainers() {
        // 概览地图
        this.initOverviewMap();
        
        // 导航地图
        this.initNavigationMap();
    }

    // 初始化概览地图
    initOverviewMap() {
        const container = document.getElementById('overviewMap');
        if (!container || !window.AMap) return;

        container.innerHTML = '<div id="overview-map-container" style="width: 100%; height: 400px;"></div>';

        this.overviewMap = new AMap.Map('overview-map-container', {
            zoom: 7,
            center: [118.0, 42.0],
            mapStyle: 'amap://styles/normal'
        });

        this.addOverviewMarkers();
        this.addRoutePolyline();
    }

    // 初始化导航地图
    initNavigationMap() {
        const container = document.getElementById('navigationMap');
        if (!container || !window.AMap) return;

        container.innerHTML = '<div id="navigation-map-container" style="width: 100%; height: 400px;"></div>';

        this.navigationMap = new AMap.Map('navigation-map-container', {
            zoom: 7,
            center: [118.0, 42.0],
            mapStyle: 'amap://styles/normal'
        });

        this.addNavigationMarkers();
    }

    // 添加概览标记
    addOverviewMarkers() {
        const routePoints = [
            { lnglat: [116.65, 40.13], name: '北京顺义', day: 'Day 1' },
            { lnglat: [118.96, 42.27], name: '赤峰市', day: 'Day 1' },
            { lnglat: [119.02, 42.11], name: '玉龙沙湖', day: 'Day 2' },
            { lnglat: [117.55, 43.26], name: '克什克腾旗', day: 'Day 2' },
            { lnglat: [116.64, 43.32], name: '达里湖', day: 'Day 3' },
            { lnglat: [117.23, 43.52], name: '热阿线', day: 'Day 3' },
            { lnglat: [116.87, 42.35], name: '乌兰布统', day: 'Day 3' },
            { lnglat: [117.23, 42.02], name: '塞罕坝', day: 'Day 4' }
        ];

        routePoints.forEach((point, index) => {
            const marker = new AMap.Marker({
                position: point.lnglat,
                title: point.name,
                content: `<div style="background: #667eea; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; white-space: nowrap;">${index + 1}</div>`
            });

            const infoWindow = new AMap.InfoWindow({
                content: `
                    <div style="padding: 10px;">
                        <h4 style="margin: 0 0 5px 0; color: #333;">${point.name}</h4>
                        <p style="margin: 0; color: #666; font-size: 12px;">${point.day}</p>
                    </div>
                `
            });

            marker.on('click', () => {
                infoWindow.open(this.overviewMap, point.lnglat);
            });

            this.overviewMap.add(marker);
        });
    }

    // 添加路线折线
    addRoutePolyline() {
        const routePath = [
            [116.65, 40.13], // 北京顺义
            [118.96, 42.27], // 赤峰市
            [119.02, 42.11], // 玉龙沙湖
            [117.55, 43.26], // 克什克腾旗
            [116.64, 43.32], // 达里湖
            [117.23, 43.52], // 热阿线
            [116.87, 42.35], // 乌兰布统
            [117.23, 42.02], // 塞罕坝
            [116.65, 40.13]  // 返回北京顺义
        ];

        const polyline = new AMap.Polyline({
            path: routePath,
            borderWeight: 2,
            strokeColor: '#667eea',
            strokeWeight: 4,
            strokeOpacity: 0.8,
            strokeStyle: 'solid'
        });

        this.overviewMap.add(polyline);
        this.overviewMap.setFitView([polyline]);
    }

    // 添加导航标记
    addNavigationMarkers() {
        const navPoints = [
            // 住宿
            { lnglat: [118.956, 42.275], name: '赤峰维也纳国际酒店', type: 'hotel', color: '#e74c3c' },
            { lnglat: [117.545, 43.264], name: '克什克腾旗草原度假酒店', type: 'hotel', color: '#e74c3c' },
            { lnglat: [116.872, 42.354], name: '乌兰布统草原假日酒店', type: 'hotel', color: '#e74c3c' },
            { lnglat: [117.234, 42.024], name: '塞罕坝森林酒店', type: 'hotel', color: '#e74c3c' },
            
            // 景点
            { lnglat: [119.021, 42.110], name: '玉龙沙湖景区', type: 'scenic', color: '#3498db' },
            { lnglat: [116.644, 43.318], name: '达里湖南岸景区', type: 'scenic', color: '#3498db' },
            { lnglat: [117.234, 43.523], name: '热阿线起点', type: 'scenic', color: '#3498db' },
            { lnglat: [116.872, 42.354], name: '乌兰布统景区', type: 'scenic', color: '#3498db' },
            { lnglat: [117.234, 42.024], name: '塞罕坝国家森林公园', type: 'scenic', color: '#3498db' },
            
            // 服务设施
            { lnglat: [118.885, 42.245], name: '赤峰市车管所', type: 'service', color: '#f39c12' },
            { lnglat: [116.665, 43.298], name: '达里湖加油站', type: 'service', color: '#f39c12' },
            { lnglat: [116.862, 42.364], name: '乌兰布统游客中心', type: 'service', color: '#f39c12' }
        ];

        const iconMap = {
            'hotel': '🏨',
            'scenic': '📷',
            'service': '⛽'
        };

        navPoints.forEach(point => {
            const marker = new AMap.Marker({
                position: point.lnglat,
                title: point.name,
                content: `<div style="background: ${point.color}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 14px;">${iconMap[point.type]}</div>`
            });

            const infoWindow = new AMap.InfoWindow({
                content: `
                    <div style="padding: 15px; min-width: 200px;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">${point.name}</h4>
                        <p style="margin: 0 0 10px 0; color: #666; font-size: 12px;">
                            坐标: ${point.lnglat[0].toFixed(3)}, ${point.lnglat[1].toFixed(3)}
                        </p>
                        <button onclick="navigateToAmapLocation(${point.lnglat[0]}, ${point.lnglat[1]}, '${point.name}')" 
                                style="background: #667eea; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; width: 100%;">
                            <i class="fas fa-navigation"></i> 高德导航
                        </button>
                    </div>
                `
            });

            marker.on('click', () => {
                infoWindow.open(this.navigationMap, point.lnglat);
            });

            this.navigationMap.add(marker);
        });
    }

    // 备用方案：使用Leaflet
    fallbackToLeaflet() {
        console.log('使用Leaflet地图作为备用方案');
        // 这里保持原有的Leaflet实现
    }

    // 路线规划
    planRoute(start, end, callback) {
        if (!window.AMap) {
            callback(null, '地图服务不可用');
            return;
        }

        const driving = new AMap.Driving({
            map: this.navigationMap,
            policy: AMap.DrivingPolicy.LEAST_TIME
        });

        driving.search(start, end, (status, result) => {
            if (status === 'complete') {
                callback(result, null);
            } else {
                callback(null, '路线规划失败');
            }
        });
    }

    // 地理编码
    geocode(address, callback) {
        if (!window.AMap) {
            callback(null, '地图服务不可用');
            return;
        }

        const geocoder = new AMap.Geocoder();
        
        geocoder.getLocation(address, (status, result) => {
            if (status === 'complete' && result.geocodes.length > 0) {
                callback(result.geocodes[0], null);
            } else {
                callback(null, '地址解析失败');
            }
        });
    }
}

// 全局导航函数（高德地图版本）
function navigateToAmapLocation(lng, lat, name) {
    // 构建高德地图URI
    const amapUri = `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}&src=travel_plan`;
    
    // 检测设备类型
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 移动设备优先尝试打开高德地图APP
        window.location.href = amapUri;
    } else {
        // 桌面设备打开网页版
        window.open(`https://ditu.amap.com/search?query=${encodeURIComponent(name)}&city=全国`, '_blank');
    }
}

// 天气查询功能
async function getWeatherInfo(city) {
    try {
        // 这里可以集成天气API
        // 示例：使用高德天气API
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('天气信息获取失败:', error);
        return null;
    }
}

// 实时路况查询
async function getTrafficInfo(route) {
    try {
        // 集成高德路况API
        const response = await fetch(`/api/traffic?route=${encodeURIComponent(route)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('路况信息获取失败:', error);
        return null;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化高德地图集成
    window.amapIntegration = new AmapIntegration();
    
    // 添加天气信息更新
    updateWeatherInfo();
    
    // 定期更新路况信息
    setInterval(updateTrafficInfo, 300000); // 每5分钟更新一次
});

// 更新天气信息
async function updateWeatherInfo() {
    const cities = ['北京', '赤峰', '承德', '克什克腾旗'];
    
    for (const city of cities) {
        const weather = await getWeatherInfo(city);
        if (weather) {
            updateWeatherDisplay(city, weather);
        }
    }
}

// 更新天气显示
function updateWeatherDisplay(city, weather) {
    const weatherElement = document.querySelector(`[data-city="${city}"]`);
    if (weatherElement && weather) {
        weatherElement.innerHTML = `
            <div class="weather-item">
                <h5>${city}</h5>
                <div class="weather-temp">${weather.temperature}°C</div>
                <div class="weather-desc">${weather.description}</div>
            </div>
        `;
    }
}

// 更新路况信息
async function updateTrafficInfo() {
    const mainRoutes = [
        '北京-赤峰',
        '赤峰-克什克腾旗',
        '克什克腾旗-乌兰布统',
        '乌兰布统-塞罕坝'
    ];
    
    for (const route of mainRoutes) {
        const traffic = await getTrafficInfo(route);
        if (traffic) {
            updateTrafficDisplay(route, traffic);
        }
    }
}

// 更新路况显示
function updateTrafficDisplay(route, traffic) {
    const trafficElement = document.querySelector(`[data-route="${route}"]`);
    if (trafficElement && traffic) {
        const statusColor = traffic.status === 'smooth' ? '#2ecc71' : traffic.status === 'slow' ? '#f39c12' : '#e74c3c';
        
        trafficElement.innerHTML = `
            <div class="traffic-item">
                <span class="route-name">${route}</span>
                <span class="traffic-status" style="color: ${statusColor};">${traffic.statusText}</span>
                <span class="traffic-time">${traffic.duration}</span>
            </div>
        `;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AmapIntegration,
        navigateToAmapLocation,
        getWeatherInfo,
        getTrafficInfo
    };
}
