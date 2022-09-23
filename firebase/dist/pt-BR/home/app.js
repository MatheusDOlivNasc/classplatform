import { read } from "./environment.js";

const language = 'pt-BR';

let modules = document.querySelector('.setModules')

read('Modules', {order: 'order', search: {data: 'language', value: language}})
  .then((res) => {
    res.filter((m) => {
      modules.innerHTML += `
        <li>
          <input type="radio" name="modules" id="${m.id}">
          <label for="${m.id}">
            <h3>${m.name}</h3>
            <p>${m.desc}</p>
          </label>
        </li>
      `
    })
  })
  .catch((error) => {
    console.log(error)
  })

