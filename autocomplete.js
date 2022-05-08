const createAutoComplete = ({root, fetchData, renderRow, onRowSelect, setInputValue}) => {
root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input">
  <div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
  </div>
`
const input = root.querySelector('input')
const dropdown = root.querySelector('.dropdown')
const dropdownContent = root.querySelector('.results')

const onInput = async event => {
  const items = await fetchData(event.target.value)

  dropdownContent.innerHTML = ''
  if (!items.length) {
    dropdown.classList.remove('is-active')
    return
  }
  dropdown.classList.add('is-active')

  for (let item of items) {
    const itemOption = document.createElement('a')
    itemOption.className = 'dropdown-item'
    itemOption.innerHTML = renderRow(item)
    itemOption.addEventListener('click', () => {
      dropdown.classList.remove('is-active')
      dropdownContent.innerHTML = ''
      input.value = setInputValue(item)
      onRowSelect(item)
    })

    dropdownContent.append(itemOption)
  }
}

input.addEventListener('input', debounce(onInput, 500))
input.addEventListener('click', onInput)
document.addEventListener('click', event => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove('is-active')
    dropdownContent.innerHTML = ''
  }
})

}


