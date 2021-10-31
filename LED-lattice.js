/*调整比例大小*/

document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
	// console.log("当前尺寸为：" + window.innerWidth);
	document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}

/* *******************全局数据*********************** */

/* 模拟器宽高 */
const SIMULATOR_LATTICE_ROWS = 16
const SIMULATOR_LATTICE_COLS = 16

const WINDOW_MAX_INTERVAL = 2000
const WINDOW_MIN_INTERVAL = 100

const REAL_POINT_SIZE = 1.5

var realRows = 16;
var realCols = 48;

var simuLattice = [];
var realLattice = [];

var simuOffsetCol = 0
var simuOffsetRow = 0

var isLoop = false
var simulatorSwitch = false

var ctrlDown = false

var isRubber = false

var outputRadix = 16

var horizontalMove = 0
var verticalMove = 0

var windowSpeed = 1

var windowMoveInterval = 500

var stepLengthx = 1
var stepLengthy = 1

var importRedix = 2


/* ********************方法区************************ */

function init(){
	// for(let i = 0;i < SIMULATOR_LATTICE_ROWS;i++){
	// 	simuLattice[i] = []
	// 	for(let j = 0;j < SIMULATOR_LATTICE_COLS;j++){
	// 		simuLattice[i][j] = 0;
	// 	}
	// }
		
	$('.led-wrapper').empty();
	for(let i = 0;i < SIMULATOR_LATTICE_ROWS;i++){
		let row = $('<div class="led-row"></div>')
		simuLattice[i] = []
		for(let j = 0;j < SIMULATOR_LATTICE_COLS;j++){
			let led = $('<div class="led"></div>')
			simuLattice[i][j] = 0
			led.attr('id',`led-${i}-${j}`)
			row.append(led)
		}
		
		$('.led-wrapper').append(row);
	}
		
	for(let i = 0;i < realRows;i++){
		realLattice[i] = [];
		for(let j = 0;j < realCols;j++){
			realLattice[i][j] = 0;
		}
	}

	renderRealTable()

	getSimulatorData()
	renderSimulator()
	renderOutput()
	closeSimulator()
}


function renderSimulator(){

	
	$('.simulator-dashboard-row').text(simuOffsetCol)
	$('.simulator-dashboard-col').text(simuOffsetRow)
	
	// $('.led-wrapper').empty();
	// for(let i = 0;i < SIMULATOR_LATTICE_ROWS;i++){
	// 	let row = $('<div class="led-row"></div>')
		
	// 	for(let j = 0;j < SIMULATOR_LATTICE_COLS;j++){
	// 		let led = $('<div class="led"></div>')
	// 		if(simuLattice[i][j] == 1){
	// 			led.addClass('led-on')
	// 		}
	// 		row.append(led)
	// 	}
		
	// 	$('.led-wrapper').append(row);
	// }
	
	for(let i = 0;i < SIMULATOR_LATTICE_ROWS;i++){
		for(let j = 0;j < SIMULATOR_LATTICE_COLS;j++){
			if(simuLattice[i][j] == 1){
				$(`#led-${i}-${j}`).addClass('led-on')
			}else{
				$(`#led-${i}-${j}`).removeClass('led-on')
			}
		}
	}
}

function renderRealTable(){
	
	let monitor = $('.lattice-monitor')
	let wrapper = $('.lattice-wrapper')
	
	let width = (realCols + 1) * REAL_POINT_SIZE * 1.1
	let height = (realRows + 1) * REAL_POINT_SIZE * 1.1
	
	monitor.css({
		width:width + 'rem',
		height:height + 'rem'
	})
	
	wrapper.empty()
	
	/* 添加坐标行 */
	let row = $('<div class="lattice-row"></div>')
	row.css('height',REAL_POINT_SIZE + 'rem')
	row.append($('<div class="lattice-tag"></div>').css({
			height:REAL_POINT_SIZE + 'rem',
			width:REAL_POINT_SIZE + 'rem'
		}))
	for(let j = 0;j < realCols;j++){
		let point = $('<div class="lattice-tag"></div>')
		point.css({
			height:REAL_POINT_SIZE + 'rem',
			width:REAL_POINT_SIZE + 'rem'
		})
		point.text(j)
		row.append(point)
	}
	
	wrapper.append(row)
	
	
	/* 逐行添加，行首添加坐标 */
	for(let i = 0;i < realRows;i++){
		let row = $('<div class="lattice-row"></div>')
		row.css('height',REAL_POINT_SIZE + 'rem')
		row.append($('<div class="lattice-tag"></div>').text(i).css({
				height:REAL_POINT_SIZE + 'rem',
				width:REAL_POINT_SIZE + 'rem'
			}))
		
		for(let j = 0;j < realCols;j++){
			let point = $('<div class="lattice-point"></div>')
			
			point.attr('id',`point-${i}-${j}`)
			point.css({
				height:REAL_POINT_SIZE + 'rem',
				width:REAL_POINT_SIZE + 'rem'
			})
			
			if(realLattice[i][j] == 1){
				point.addClass('lattice-point-selected')
			}
			
			row.append(point)
		}
		wrapper.append(row)
	}
	
	/* 添加点阵事件 */
	$('.lattice-point').click(function(){
		// console.log($(this).attr('id'))
		let id = $(this).attr('id')
		let x = id.split('-')[1]
		let y = id.split('-')[2]
		
		realLattice[x][y] = 1 - realLattice[x][y]
		
		if(realLattice[x][y] == 1){
			$(this).addClass('lattice-point-selected')
		}else{
			$(this).removeClass('lattice-point-selected')
		}
		
		refreshSimulator()
		renderOutput()
	})
	
	$('.lattice-point').on('mouseenter',function(){
		
		 // console.log($(this))
		if(!ctrlDown){
			return
		}
		
		let id = $(this).attr('id')
		let x = id.split('-')[1]
		let y = id.split('-')[2]
		
		if(isRubber){
			// console.log('rubber')
			realLattice[x][y] = 0
		}else{
			realLattice[x][y] = 1
		}
		
		
		if(realLattice[x][y] == 1){
			$(this).addClass('lattice-point-selected')
		}else{
			$(this).removeClass('lattice-point-selected')
		}
		renderOutput()
	})
	
}

function getSimulatorData(){
	
	for(let i = 0;i < SIMULATOR_LATTICE_ROWS;i++){
		for(let j = 0;j < SIMULATOR_LATTICE_COLS;j++){
			simuLattice[i][j] = realLattice[(i + simuOffsetRow) % realRows][(j + simuOffsetCol) % realCols]
		}
	}
	
}

function getSimulatorArea(){
	
	let rowLine = realRows - SIMULATOR_LATTICE_ROWS
	let colLine = realCols - SIMULATOR_LATTICE_COLS
	
	// console.log('rowList',rowLine)
	// console.log('colLine',colLine)
	
	if(simuOffsetRow <= rowLine && simuOffsetCol <=colLine){
		return [
			{
				top:simuOffsetRow,
				left:simuOffsetCol,
				height:SIMULATOR_LATTICE_ROWS,
				width:SIMULATOR_LATTICE_COLS,
				border:{
					top:true,
					bottom:true,
					left:true,
					right:true
				}
			}
		]
	}else if(simuOffsetRow > rowLine && simuOffsetCol <= colLine){
		return [
			{
				top:simuOffsetRow,
				left:simuOffsetCol,
				height:realRows - simuOffsetRow,
				width:SIMULATOR_LATTICE_COLS,
				border:{
					top:true,
					bottom:false,
					left:true,
					right:true
				}
			},{
				top:0,
				left:simuOffsetCol,
				height:SIMULATOR_LATTICE_ROWS - (realRows - simuOffsetRow),
				width:SIMULATOR_LATTICE_COLS,
				border:{
					top:false,
					bottom:true,
					left:true,
					right:true
				}
			}
		]
	}else if(simuOffsetRow <= rowLine && simuOffsetCol > colLine){
		return [
			{
				top:simuOffsetRow,
				left:simuOffsetCol,
				height:SIMULATOR_LATTICE_ROWS,
				width:realCols - simuOffsetCol,
				border:{
					top:true,
					bottom:true,
					left:true,
					right:false
				}
			},{
				top:simuOffsetRow,
				left:0,
				height:SIMULATOR_LATTICE_ROWS,
				width:SIMULATOR_LATTICE_COLS - (realCols - simuOffsetCol),
				border:{
					top:true,
					bottom:true,
					left:false,
					right:true
				}
			}
		]
	}else{
		return [
			{
				top:simuOffsetRow,
				left:simuOffsetCol,
				height:realRows - simuOffsetRow,
				width:realCols - simuOffsetCol,
				border:{
					top:true,
					bottom:false,
					left:true,
					right:false
				}
			},{
				top:simuOffsetRow,
				left:0,
				height:realRows - simuOffsetRow,
				width:SIMULATOR_LATTICE_COLS - (realCols - simuOffsetCol),
				border:{
					top:true,
					bottom:false,
					left:false,
					right:true
				}
			},{
				top:0,
				left:simuOffsetCol,
				height:SIMULATOR_LATTICE_ROWS - (realRows - simuOffsetRow),
				width:realCols - simuOffsetCol,
				border:{
					top:false,
					bottom:true,
					left:true,
					right:false
				}
			},{
				top:0,
				left:0,
				height:SIMULATOR_LATTICE_ROWS - (realRows - simuOffsetRow),
				width:SIMULATOR_LATTICE_COLS - (realCols - simuOffsetCol),
				border:{
					top:false,
					bottom:true,
					left:false,
					right:true
				}
			}
		]
	}
}

function renderWindows(){
	
	if(!simulatorSwitch){
		return
	}
	
	let container = $('.lattice-windows')
	container.empty()
	
	let windows = getSimulatorArea()
	// console.log(windows)
	
	for(wd of windows){
		let div = $('<div class="lattice-window"></div>')
		div.css({
			top:(wd.top + 1) * REAL_POINT_SIZE * 1.1 + 'rem',
			left:(wd.left + 1) * REAL_POINT_SIZE * 1.1 + 'rem',
			height:wd.height * REAL_POINT_SIZE * 1.1 + 'rem',
			width:wd.width * REAL_POINT_SIZE * 1.1 + 'rem',
			borderTop:wd.border.top ? '.25rem' : '0rem',
			borderBottom:wd.border.bottom ? '.25rem' : '0rem',
			borderLeft:wd.border.left ? '.25rem' : '0rem',
			borderRight:wd.border.right ? '.25rem' : '0rem',
			borderStyle:'dashed',
			borderColor:'red'
		})
		container.append(div)
	}
	
}

function refreshSimulator(){
	
	if(!simulatorSwitch){
		return
	}
	
	getSimulatorData()
	renderSimulator()
	renderWindows()
}


function closeSimulator(){
	$('.lattice-windows').empty()
	for(let i = 0;i < SIMULATOR_LATTICE_ROWS;i++){
		simuLattice[i] = []
		for(let j = 0;j < SIMULATOR_LATTICE_COLS;j++){
			simuLattice[i][j] = 0;
		}
	}
	renderSimulator()

}

function renderOutput(){
	let output = ''
	
	if(outputRadix == 16){
		for(let i = 0;i < realRows;i++){
			for(let j = 0;j < realCols;j += 8){
				let val = 0
				for(let k = 0;k < 8;k++){
					val = val * 2 + realLattice[i][j + k]
				}
				output += getHex(val)
				if(j < realCols - 8){
					output += ','
				}
			}
			if(i < realRows - 1){
				output += '</br>'
			}
		}
	}else if(outputRadix == 2){
		for(let i = 0;i < realRows;i++){
			for(let j = 0;j < realCols;j++){
				output += realLattice[i][j]
				if(j < realCols - 1){
					output += ','
				}
			}
			if(i < realRows - 1){
				output += '</br>'
			}
		}
	}
	
	$('.output-screen').html(output)
}

function getHex(val){
        let hex = ''
        
        hex = '' + getChar(val % 16)
        val = Math.floor(val / 16)
        hex = getChar(val % 16) + hex
        return '0' + hex + 'H'
    }

function getChar(val){
	return val < 10 ? val : String.fromCharCode(val - 10 + 65)
}

function endHorizontalMove(){
	clearInterval(horizontalMove)
	horizontalMove = 0
}

function endVerticalMove(){
	clearInterval(verticalMove)
	verticalMove = 0
}

function startHorizontalMove(){
	horizontalMove = setInterval(function(){
		if(isLoop){
			console.log(simuOffsetCol)
			simuOffsetCol = (simuOffsetCol + stepLengthx) % realCols
			console.log(simuOffsetCol)
		}else{
			simuOffsetCol = Math.min(realCols - SIMULATOR_LATTICE_COLS,simuOffsetCol + stepLengthx)
		}
		renderWindows()
		refreshSimulator()
	},windowMoveInterval)
}

function startVerticalMove(){
	verticalMove = setInterval(function(){
		if(isLoop){
			simuOffsetRow = (simuOffsetRow + stepLengthy) % realRows
		}else{
			simuOffsetRow = Math.min(realRows - SIMULATOR_LATTICE_ROWS,simuOffsetRow + 1)
		}
		renderWindows()
		refreshSimulator()
	},windowMoveInterval)
}

function showMask(){
	$('.mask').fadeIn(50)
}

function hideMask(){
	$('.mask').fadeOut(50)
}

function showIntroduction(){
	$('.introduction').show()
}

function hideIntorduction(){
	$('.introduction').hide()
}

function showSettings(){
	$('.settings').show()
	
	let row = Math.floor(realRows / 16)
	let col = Math.floor(realCols / 16)
	
	$('.settings-rows input').val(row)
	$('.settings-cols input').val(col)
	$('.settings-speed input').val(windowMoveInterval)
	$('.settings-step-x input').val(stepLengthx)
	$('.settings-step-y input').val(stepLengthy)

	$('.settings-rows .result').text(` x 16 = ${realRows}`)
	$('.settings-cols .result').text(` x 16 = ${realCols}`)
}

function hideSettings(){
	$('.settings').hide()
}

function showImport(){
	$('.import').show()
	$('.import textarea').val('')
}

function hideImport(){
	$('.import').hide()
}

function clearMask(){
	hideSettings()
	hideIntorduction()
	hideImport()
}

function checkHex(hex){
	return /0[0-9A-F][0-9A-F]H/g.test(hex)
}

function parseHex(hex){
	
	let highbit = hex[1].charCodeAt() - (/[0-9]/g.test(hex[1]) ? 48 : 55) 
	let lowbit = hex[2].charCodeAt() - (/[0-9]/g.test(hex[1]) ? 48 : 55) 
	
	return highbit * 16 + lowbit
	
}

function importFromMap(mp,redix){
	mp = mp.split('\n')
	
	// console.log(mp.length)
	if(redix === 2){
		if(!mp || mp.length % 16 != 0 || mp.length > 80 || mp.length < 16){
			alert('导入失败：行数非法！')
			return
		}
		
		let last = -1
		for(let i = 0;i < mp.length;i++){
			let row = mp[i]
			mp[i] = mp[i].split(',')
			if(!mp[i] || mp[i].length % 16 != 0 || mp[i].length > 80 || mp[i].length < 16){
				alert('导入失败：列数非法！')
				return
			}
			if(last != -1 && mp[i].length != last){
				alert('导入失败：列数非法！')
				return
			}
			last = mp[i].length
			for(let j = 0;j < mp[i].length;j++){
				if(mp[i][j].length != 1 || (mp[i][j] != '0' && mp[i][j] != '1')){
					console.log(mp[i][j])
					alert('导入失败：非法元素！')
					return
				}
				mp[i][j] = (mp[i][j] === '1' ? 1 : 0)
			}
		}
		
		realCols = last
		realRows = mp.length
		
		init()
		for(let i = 0;i < mp.length;i++){
			realLattice[i] = []
			for(let j = 0;j < mp[i].length;j++){
				realLattice[i][j] = mp[i][j];
			}
		}
	}
	if(redix === 16){
		if(!mp || mp.length % 16 != 0 || mp.length > 80 || mp.length < 16){
			alert('导入失败：行数非法！')
			return
		}
		
		let last = -1
		for(let i = 0;i < mp.length;i++){
			mp[i] = mp[i].split(',')
			console.log(mp[i])
			if(!mp[i] || mp[i].length % 2 != 0 || mp[i].length > 10 || mp[i].length < 2){
				alert('导入失败：列数非法！')
				return
			}
			if(last != -1 && mp[i].length != last){
				alert('导入失败：列数非法！')
				return
			}
			last = mp[i].length
			for(let j = 0;j < mp[i].length;j++){
				if(!checkHex(mp[i][j])){
					alert('导入失败：格式错误！')
					return
				}
				mp[i][j] = parseHex(mp[i][j])
			}
		}
		
		realCols = last * 8
		realRows = mp.length
		
		init()
		for(let i = 0;i < mp.length;i++){
			realLattice[i] = []
			for(let j = 0;j < mp[i].length;j++){
				for(let k = 0;k < 8;k++){
					realLattice[i][j * 8 + k] = (mp[i][j] >> (8 - k)) & 1
				}
			}
		}
	}
	
	
	renderRealTable()
	renderOutput()
	alert('导入成功！')
	return
}

/*  */
init()

/*  */

$('.import .redix').on('click',function(){
	
	if(importRedix === 2){
		importRedix = 16
		$('.import .redix').text('当前进制：16 点击切换')
	}else{
		importRedix = 2
		$('.import .redix').text('当前进制：2 点击切换')
	}
	
})

$('.settings-step-x input').on('change',function(){
	let val = $(this).val()
	
	val = Math.floor(val)
	val = Math.min(val,16)
	val = Math.max(val,1)
	
	$(this).val(val)
})

$('.settings-step-y input').on('change',function(){
	let val = $(this).val()
	
	val = Math.floor(val)
	val = Math.min(val,16)
	val = Math.max(val,1)
	
	$(this).val(val)
})

$('.import .ok').on('click',function(){
	let mp = $('.import textarea').val()
	importFromMap(mp,importRedix)
	
	hideMask()
})

$('.panel-import').on('click',function(){
	showMask()
	clearMask()
	showImport()
})

$('.settings .ok').on('click',function(){
	let row = $('.settings-rows input').val()
	let col = $('.settings-cols input').val()
	let speed = $('.settings-speed input').val()
	let stepx = $('.settings-step-x input').val()
	let stepy = $('.settings-step-y input').val()
	
	
	realRows = row * 16
	realCols = col * 16
	stepLengthx = stepx * 1
	stepLengthy = stepy * 1
	windowMoveInterval = speed
	
	init()
	hideMask()
	simuOffsetCol = 0
	simuOffsetRow = 0
	if(horizontalMove != 0){
		$('.simulator-control-horizontal').click()
		$('.simulator-control-horizontal').click()
	}
	
	if(verticalMove != 0){
		$('.simulator-control-vertical').click()
		$('.simulator-control-vertical').click()
	}
})

$('.settings-speed input').on('change',function(){
	let val = $(this).val()
	
	val = Math.floor(val)
	val = Math.min(val,WINDOW_MAX_INTERVAL)
	val = Math.max(val,WINDOW_MIN_INTERVAL)
	
	$(this).val(val)
})

$('.settings-rows input').on('change',function(){
	let val = $(this).val()
	
	val = Math.floor(val)
	val = Math.min(val,5)
	val = Math.max(val,0)
	// console.log(val)
	
	$(this).val(val)
	$('.settings-rows .result').text(` x 16 = ${val * 16}`)
})

$('.settings-cols input').on('change',function(){
	let val = $(this).val()
	
	val = Math.floor(val)
	val = Math.min(val,5)
	val = Math.max(val,0)
	console.log(val)
	
	$(this).val(val)
	$('.settings-cols .result').text(` x 16 = ${val * 16}`)
	
})

$('.panel-settings').click(function(){
	showMask()
	clearMask()
	showSettings()
})

$('.panel-introduction').click(function(){
	showMask()
	clearMask()
	showIntroduction()
})

$('.cross').click(hideMask)
$('.introduction>.ok').click(hideMask)


$(document).on('keyup',function(e){
	// console.log(e.keyCode)
	if(e.keyCode === 17){
		ctrlDown = false;
	}
})

$(document).on('keydown',function(e){
	// console.log(e.keyCode)
	
	if(e.keyCode === 17){
		ctrlDown = true;
	}
	
	if(simulatorSwitch){
		if(e.keyCode === 65){
			if(isLoop){
				simuOffsetCol = (realCols - 1 + simuOffsetCol) % realCols
			}else{
				simuOffsetCol = Math.max(0,simuOffsetCol - 1)
			}
		}
		if(e.keyCode === 68){
			if(isLoop){
				simuOffsetCol = (realCols + 1 + simuOffsetCol) % realCols
			}else{
				simuOffsetCol = Math.min(realCols - SIMULATOR_LATTICE_COLS,simuOffsetCol + 1)
			}
		}
		if(e.keyCode === 83){
			if(isLoop){
				simuOffsetRow = (realRows + 1 + simuOffsetRow) % realRows
			}else{
				simuOffsetRow = Math.max(0,simuOffsetRow - 1)
			}
		}
		if(e.keyCode === 87){
			if(isLoop){
				simuOffsetRow = (realRows - 1 + simuOffsetRow) % realRows
			}else{
				simuOffsetRow = Math.max(0,simuOffsetRow - 1)
			}
		}
	}
	refreshSimulator()
})

$('.simulator-control-switch').on('click',function(){
	
	
	if(isLoop){
		$('.simulator-control-loop').click()
	}
	simulatorSwitch = !simulatorSwitch
	
	$(this).text(simulatorSwitch ? '关闭模拟器':'开启模拟器')
	
	if(!simulatorSwitch){
		closeSimulator()
		$(this).removeClass('button-turnon')
	}else{
		$(this).addClass('button-turnon')
	}
	refreshSimulator()
})

$('.simulator-control-loop').on('click',function(){
	
	if(!simulatorSwitch){
		return
	}
	
	
	let rowLine = realRows - SIMULATOR_LATTICE_ROWS
	let colLine = realCols - SIMULATOR_LATTICE_COLS
	
	if(!isLoop){
		$(this).text('关闭循环')
		$(this).addClass('button-turnon')
		
	}else{
		$(this).removeClass('button-turnon')
		$(this).text('开启循环')
		simuOffsetCol = 0
		simuOffsetRow = 0
		
		if(horizontalMove != 0){
			$('.simulator-control-horizontal').click()
		}
		if(verticalMove != 0){
			$('.simulator-control-vertical').click()
		}
	}
	isLoop = !isLoop
	refreshSimulator()
	
})

$('.panel-rubber').on('click',function(){
	
	isRubber = !isRubber
	
	if(isRubber){
		$(this).addClass('button-turnon')
	}else{
		$(this).removeClass('button-turnon')
	}
	
})

$('.panel-clear').on('click',function(){
	init()
})

$('.output-control-radix').on('click',function(){
	if(outputRadix == 2){
		outputRadix = 16
		$(this).text('二进制')
	}else{
		$(this).text('十六进制')
		outputRadix = 2
	}
	renderOutput()
})

$('.simulator-control-horizontal').on('click',function(){
	if(!simulatorSwitch){
		return
	}
	
	if(horizontalMove != 0){
		$(this).text('开启水平滚动')
		$(this).removeClass('button-turnon')
		endHorizontalMove()
	}else{
		$(this).text('关闭水平滚动')
		$(this).addClass('button-turnon')
		startHorizontalMove()
	}
	
})

$('.simulator-control-vertical').on('click',function(){
	if(!simulatorSwitch){
		return
	}
	
	if(verticalMove != 0){
		$(this).text('开启垂直滚动')
		$(this).removeClass('button-turnon')
		endVerticalMove()
	}else{
		$(this).text('关闭垂直滚动')
		$(this).addClass('button-turnon')
		startVerticalMove()
	}
})

