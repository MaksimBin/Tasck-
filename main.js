const startProject = () => {
  let num = 200
  setInterval(() => {
    if (num !== 0) {
      num = num - 1
      document.querySelector('.start_block').style = `width: ${num}px;`
    } else if (num > -5) {
      setTimeout(() => {
        document.querySelector('.startProject').style = `display:none;`
      }, 1000)
    }
  }, 20)
}

startProject()

const parseSaveLocalStorage = (key, arr) => {
  localStorage.setItem(key, JSON.stringify(arr))
}

let arrayTascks = []

let tasckStors = JSON.parse(localStorage.getItem('tascsStor'))

if (tasckStors == null) {
  parseSaveLocalStorage('tascsStor', arrayTascks)
} else {
  arrayTascks = [...tasckStors]
}

const generateNumericId = () => {
  let id = crypto.randomUUID().replace(/-/g, '');
  return Number(BigInt('0x' + id).toString().slice(0, 7));
}

const createTasck = () => {
  let date = new Date()
  let tasck = {
    id: generateNumericId(),
    name: "Tasck",
    value: "_ _",
    overTasck: false,
    timeTasck: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    dateTasck: `0${date.getDay()}:0${date.getMonth()}:${date.getFullYear()}`
  }

  arrayTascks.unshift(tasck)
  parseSaveLocalStorage('tascsStor', arrayTascks)
  renderTascks(arrayTascks)
  renderSumTasc()
}

const getBackgroundTascks = (text, over) => {
  if (over) {
    return 'orangered'
  }
  if (text == '_ _') {
    return 'black'
  }
  if (text == '') {
    return 'darkslategrey'
  }
  if (text !== '' && text !== '_ _') {
    return 'midnightblue'
  }
}

const renderTascks = (arr) => {
  
  if (arr.length == []) {
    document.getElementById('app').innerHTML = '<div class="arrNoneGetText"><h3>Нет <span>записей</span></h3></div>'
  } else {
    document.getElementById('app').innerHTML = arr.map(a => `
     <div style="background: ${getBackgroundTascks(a.value, a.overTasck)};" class="contentBlock">
           <div onclick="openTasck(${a.id})" class="content_text">
        ${a.name} - - <span style="color:yellow; font-size:20px;">${a.timeTasck}</span>
      </div>
      <div class="deleteTasck" onclick="deleteTasck(${a.id})">×</div>
    </div>
    `).join('')
  }
}

renderTascks(arrayTascks)

const renderTasck = (id) => {
  let tasck = arrayTascks.filter(x => x.id == id).shift()
  document.querySelector('.modalDialog').innerHTML = `
    <div class="tasck">
    <h1>${tasck.name}</h1>
    <textarea id="areaValue" cols="40" rows="14">${tasck.value}</textarea>
    <div class="time">${tasck.timeTasck}</div>
    <div class="date">${tasck.dateTasck}</div>
    <button class="btn" type="button" onclick="saveTasck(${tasck.id})">Сохранить</button>
    <button class="btn" type="button"onclick="clearTasck(${tasck.id})">Отчистить</button>
      <button class="tasckOver" type="button"onclick="overTasck(${tasck.id})">Завершить</button>
  </div>
  `
}

const openTasck = (id) => {
  closeDisplayFilter()
  openModal()
  renderTasck(id)
}

const saveTasck = (id) => {
  let area = document.getElementById('areaValue').value
  arrayTascks.map(x => {
    if (x.id == id) {
      x.value = area
    }
  })
  parseSaveLocalStorage('tascsStor', arrayTascks)
  closeModal()
  openDisplayFilter()
  renderTascks(arrayTascks)
}

const clearTasck = (id) => {
  arrayTascks.map(x => {
    if (x.id == id) {
      x.value = ''
    }
  })
  parseSaveLocalStorage('tascsStor', arrayTascks)
  renderTasck(id)
}

let getFilterRender = {
  boolFilter: false,
  switchFilter: ""
}

const deleteTasck = (id) => {
  arrayTascks = [...arrayTascks.filter(x => x.id !== id)]
  parseSaveLocalStorage('tascsStor', arrayTascks)
  
  if (getFilterRender !== "" && getFilterRender.boolFilter == true) {
    getFilter(getFilterRender.switchFilter)
  } else {
    renderTascks(arrayTascks)
  }
  renderSumTasc()
}

const overTasck = (id) => {
  arrayTascks.map(x => {
    if (x.id == id) {
      x.overTasck = true
    }
  })
  parseSaveLocalStorage('tascsStor', arrayTascks)
  closeModal()
  openDisplayFilter()
  renderTascks(arrayTascks)
}

const renderSumTasc = () => {
  let sumTascs = arrayTascks.length
  if (sumTascs !== 0) {
    document.querySelector('.sumTascks').innerHTML = sumTascs
  } else {
    document.querySelector('.sumTascks').innerHTML = 0
  }
}

renderSumTasc()

const openModal = () => {
  document.querySelector('.modalDialog').style = "display:block"
}

const closeModal = () => {
  document.querySelector('.modalDialog').style = "display:none"
}

let bool = false

const closeDisplayFilter = () => {
  document.querySelector('.footerFilter').style = "display:none;"
  bool = false
}

const openDisplayFilter = () => {
  document.querySelector('.footerFilter').style = "display:block;"
  bool = false
}

const openCloseFilter = () => {
  
  if (bool == false) {
    document.querySelector('.footerFilter').style = 'position: fixed;bottom: -75vh;left: 0px;transition-duration:.4s;'
    bool = true
    return
  }
  
  if (bool == true) {
    document.querySelector('.footerFilter').style = 'position: fixed;bottom: -99.5vh;left: 0px;'
    bool = false
    return
  }
}

const getFilter = (params) => {
  
  switch (params) {
    case '0':
      renderTascks(arrayTascks)
      getFilterRender.switchFilter = '0'
      getFilterRender.boolFilter = true
      break;
      
    case '1':
      renderTascks(arrayTascks.filter((a) => a.overTasck == true))
      getFilterRender.switchFilter = "1"
      getFilterRender.boolFilter = true
      break;
      
    case '2':
      renderTascks(arrayTascks.filter((a) => a.value == '_ _')
        .filter((x) => x.overTasck !== true)
      )
      getFilterRender.switchFilter = "2"
      getFilterRender.boolFilter = true
      break;
      
    case '3':
      renderTascks(
        arrayTascks.filter((a) => a.value !== '_ _')
        .filter((x) => x.overTasck !== true)
        .filter((z) => z.value !== '')
      )
      getFilterRender.switchFilter = "3"
      getFilterRender.boolFilter = true
      break;
      
    case '4':
      renderTascks(
        arrayTascks.filter((a) => a.value == '')
        .filter((x) => x.overTasck !== true)
      )
      getFilterRender.switchFilter = "4"
      getFilterRender.boolFilter = true
      break;
      
    default:
      // Tab to edit
  }
}