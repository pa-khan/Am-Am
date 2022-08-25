function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// CHECK
class Check {
  static addError(element, message) {
    element.classList.add(Check.classError);

    if (message) {
      element.querySelector('.check__message').innerText = message;
    }
  }

  constructor(element) {
    this.element = element;
    this.input = this.element.input = this.element.querySelector('.check__input');
    this.type = this.input.type;
    this.checkChecked();
    this.onClick();

    this.element.input = this.input;
  }

  onClick() {
    this.element.addEventListener('click', (event) => {
      this.element.classList.remove('--error');
      if (event.target.closest('[data-popup]') || this.element.classList.contains('--disabled')) {
        return false;
      }
      if (this.type == 'checkbox') {
        this.element.classList.toggle('--checked');
        this.checked = this.input.getAttribute('checked');

        if (this.checked) {
          this.input.removeAttribute('checked');
        } else {
          this.input.setAttribute('checked', 'checked');
        }

      } else if (this.type == 'radio') {
        if (this.element.closest('--checked')) {
          return false;
        }

        this.name = this.input.name;
        let parent = this.element.closest('.checks') ? this.element.closest('.checks') : this.element.closest('form') ? this.element.closest('form') : document.body;
        let radios = parent.querySelectorAll('.check input[type="radio"][name="' + this.name + '"]');
        radios.forEach(radio => {
          radio.removeAttribute('checked');
          radio.closest('.check').classList.remove('--checked');
        });
        this.element.classList.add('--checked');
        this.input.setAttribute('checked', 'checked');
      }
    });
  }

  checkChecked() {
    if (this.input.getAttribute('checked')) {
      this.element.classList.add('--checked');
    }
  }
}

// SELECT
class Select {
  constructor(element, settings = {
    closeSelects: true
  }) {
    this.element = element;
    this.settings = settings;
    this.title = element.querySelector('.select__title');

    this.placeholder = this.element.getAttribute('data-placeholder');
    this.list = this.element.querySelector('.select__list');
    this.field = this.element.querySelector('.field');
    this.items = [];

    if (this.list) {
      this.items = this.list.querySelectorAll('.select__item');
      this.itemCurrent = null;

      this.items.forEach((item) => {
        if (item.classList.contains(Select.classSelected)) {
          this.itemCurrent = item;
        }

        item.addEventListener('click', () => {
          this.itemCurrent.classList.remove(Select.classSelected);
          this.itemCurrent = item;

          this.itemCurrent.classList.add(Select.classSelected);
          this.placeholder = this.itemCurrent.innerHTML;
          this.title.innerHTML = this.placeholder;

          this.element.val = this.itemCurrent.dataset.value;

          this.setElementAttributes();

          this.element.dispatchEvent(new Event('change'));
        });
      });

      this.itemCurrent = this.itemCurrent ? this.itemCurrent : this.items[0];
      this.itemCurrent.classList.add(Select.classSelected);
      this.placeholder = this.itemCurrent.innerHTML;

      this.title.innerHTML = this.placeholder;
      this.element.val = this.itemCurrent.dataset.value;
      this.setElementAttributes();



    } else {
      this.parse = this.element.querySelector('.select__parse');
      this.options = this.parse.querySelectorAll('option');

      this.options = Array.from(this.options);
      let selectedOption = this.options.find(item => {
        if (item.getAttribute('selected')) {
          return item;
        }
      });

      this.placeholder = selectedOption ? selectedOption.innerText : this.placeholder ? this.placeholder : this.options[0].innerText;


      this.createList();
      this.createItems();

    }


    this.title.innerHTML = this.placeholder;
    this.onClick();

    if (this.field) {
      this.onKeyUpField();
    }

  }

  createList() {
    this.list = document.createElement('div');
    this.list.className = 'select__list';
    this.element.querySelector('.select__drop').append(this.list);
  }

  createItems() {
    this.options.forEach(item => {
      let divItem = document.createElement('div');
      divItem.className = 'select__item';
      divItem.innerText = item.innerText;
      divItem.option = item;

      if (item.getAttribute('selected')) {
        this.element.classList.add(Select.classFilled);
        divItem.classList.add(Select.classSelected);
      }

      this.list.append(divItem);
      this.items.push(divItem);
      divItem.addEventListener('click', () => {
        this.onClickItem(divItem);
        this.element.classList.add(Select.classFilled);
      });
    });
  }

  onClickItem(item) {
    this.options.forEach(option => {
      option.removeAttribute('selected');
    });
    this.items.forEach(item => {
      item.classList.remove(Select.classSelected);
    });
    item.option.setAttribute('selected', 'selected');
    item.classList.add(Select.classSelected);
    this.title.innerText = item.innerText;
    let event = new Event('change');
    this.parse.dispatchEvent(event);
  }

  onClick() {
    this.element.addEventListener('click', event => {
      if (this.settings.closeSelects == true) {
        let selects = document.querySelectorAll('.select');

        if (selects) {
          selects.forEach(select => {
            if (select == this.element) {
              return false;
            }

            select.classList.remove(Select.classOpen);
          });
        }
      }

      if (event.target.closest('.field')) {
        return false;
      }

      this.element.classList.toggle(Select.classOpen);
    });
  }

  setElementAttributes() {
    for (let data of Object.entries(this.itemCurrent.dataset)) {
      this.element.setAttribute('data-' + data[0], data[1]);
    }
  }
  onKeyUpField() {
    this.field.area.addEventListener('input', () => {
      this.items.forEach(item => {
        if (item.innerText.toLowerCase().indexOf(this.field.area.value.toLowerCase()) < 0) {
          item.classList.add(Select.classHidden);
        } else {
          item.classList.remove(Select.classHidden);
        }
      });
    });
  }

}

_defineProperty(Select, "classOpen", '--open');
_defineProperty(Select, "classFilled", '--filled');
_defineProperty(Select, "classSelected", '--selected');
_defineProperty(Select, "classHidden", '--hidden');
_defineProperty(Select, "classError", '--error');