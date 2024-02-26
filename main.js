// Генерация случайных координат
function coordLon() {
	let lonCoord = Math.random() * (39.201 - 39.1501) + 39.1501
	console.log(' Dspjd')
	return lonCoord
}
function coordLat() {
	let latCoord = Math.random() * (51.751 - 51.651) + 51.651
	console.log(' Dspjd cl')
	return latCoord
}

// Инициализация координат
const initLon = coordLon()
const initLat = coordLat()

const coordinates = [
	{
		lon: initLon,
		lat: initLat,
	},
]
let points = [[initLon, initLat]]

// Инициализация карты

const map = new ol.Map({
	layers: [
		new ol.layer.Tile({
			source: new ol.source.TileJSON({
				url: 'https://api.maptiler.com/maps/basic-v2/tiles.json?key=io2J1288mOzH2xstF4lB',
				tileSize: 512,
			}),
		}),
	],
	target: 'map',
	view: new ol.View({
		center: ol.proj.fromLonLat([initLon, initLat]),
		zoom: 13,
	}),
})

// Инициализация маркера (Точки)
const markerFeature = new ol.Feature({
	geometry: new ol.geom.Point(
		ol.proj.fromLonLat([
			coordinates[coordinates.length - 1].lon,
			coordinates[coordinates.length - 1].lat,
		])
	),
})

// Создание траектории

for (let i = 0; i < points.length; i++) {
	// Трансформация координат
	points[i] = ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857')
}

let featureLine = new ol.Feature({
	geometry: new ol.geom.LineString(points),
})

let vectorLine = new ol.source.Vector({})
vectorLine.addFeature(featureLine)

// Инициализация траектории

let vectorLineLayer = new ol.layer.Vector({
	source: vectorLine,
	style: new ol.style.Style({
		fill: new ol.style.Fill({ color: 'red', weight: 4 }),
		stroke: new ol.style.Stroke({ color: 'red', width: 2 }),
	}),
})

const layer = new ol.layer.Vector({
	source: new ol.source.Vector({
		features: [markerFeature],
	}),
	style: new ol.style.Style({
		image: new ol.style.Icon({
			anchor: [0.5, 0.5],
			scale: 0.5,
			opacity: 1,
			crossOrigin: 'anonymous',
			src: 'icon.png',
		}),
	}),
})

// Инициализирующая отрисовка
map.addLayer(layer) // Метка
map.addLayer(vectorLineLayer) // Траектория

// Имитация получения и отображения данных
const interval = setInterval(() => {
	// Получение
	coordinates.push({
		lon: coordLon(),
		lat: coordLat(),
	})
	let newPoints = [
		[
			coordinates[coordinates.length - 1].lon,
			coordinates[coordinates.length - 1].lat,
		],
	]

	// Обработка (Трансформация координат)
	for (let i = 0; i < newPoints.length; i++) {
		newPoints[i] = ol.proj.transform(newPoints[i], 'EPSG:4326', 'EPSG:3857')
	}

	points = [...points, newPoints[0]]

	// Отрисовка траектории и перемещение метки
	featureLine.set('geometry', new ol.geom.LineString(points))

	markerFeature.set(
		'geometry',
		new ol.geom.Point(
			ol.proj.fromLonLat([
				coordinates[coordinates.length - 1].lon,
				coordinates[coordinates.length - 1].lat,
			])
		)
	)
}, 1000)

// Сброс Интервала (10 секунд)
setTimeout(() => {
	clearInterval(interval)
}, 10000)
