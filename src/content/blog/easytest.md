---
title: EasyTest - Тестування JavaScript та TypeScript без зусіль!
date: 2024-10-03
cover: {
    src: /images/testing.svg
}
category: "Тестування"
tags: ["javascript", "typescript", "easytest", "testing"]
sort: 1
slug: easytest-welcome
draft: false
---

> Репозиторій EasyTest: https://github.com/olton/easytest

## Вступ

У цій статті я розповім про мій власний тестовий фреймворк для JavaScript/TypeScript, який допомагає мені полегшити процес тестування та забезпечити високу якість коду. Ми розглянемо основні можливості фреймворку, його архітектуру та приклади використання.

<!-- -->

## Передумови створення

Чому я вирішив створити свій фреймворк? Я багато пишу кода на Javascript, тож його треба якось тестувати. Звичайно, ви скажете що вже є JEST, VITEST та інші. Але мені захотілось створити власний! По-перше - це чудовий засіб підвищити свої навички в JavaScript, по-друге - розуміти, як такі фреймворки працюють “під капотом” може дуже сильно допомогти в плануванні тестування власного коду. Ну і в загалі - чи зможу?

## Планування функціонала

Перше, з чого необхідно починати будь-який проєкт - це планування його функціоналу. Що я хотів бачити у своєму фреймворку:

**Типи тестів:**

- Юніт-тести
- Інтеграційні тести

**Можливості:**

- Легкий початок роботи з фреймворком (config free)
- Тестування JavaScript та TypeScript коду без зайвого клопоту
- Тестування асинхронного коду
- Тестування HTML об’єктів (Document, HTMLElement, …)
- Mocking (функції та об’єкти)
- Багато очікувань (expect) в одному тесті - тест вважається виконаним, якщо всі очікування завершились без помилок.
- Велика кількість вбудованих matchers (функцій перевірки)
- Можливість розширення переліку доступних matchers прямо в тестах
- Підтримка стандартних функцій describe, it, test, and expect
- Підтримка функцій Setup та Teardown (beforeEach, beforeAll, afterEach, afterAll)
- Можливість формування звіту щодо покриття коду (в тому числі можливість взаємодії з CODECOV)
- Можливість писати тести як на JS, так і на TS та комбінувати їх в одному проєкті

## Архітектура фреймворку

Фреймворк містити декілька структурних компонентів:

- Створювач черги виконання тестів
- Виконувач тестів
- Модуль Assertion
- Інструменти Mocking
- Профайлер для генерування звіту про покриття коду тестами
- Репортер для формування звіту про покриття коду тестами в форматі LCOV

#### Створювач черги виконання тестів

Фреймворк починає свою роботу зі створення черги виконання тестів. Для кожного тестового файлу створюється контекст виконання, в якому для кожного набору тестів та окремих тестів додаються функції встановлення та демонтажу (Setup and Teardown функції). За своїм призначенням ці функції є:

- beforeAll - виконати код перед всіма тестами
- beforeEach - виконати код перед кожним тестом
- afterEach - виконати код після кожного тесту
- afterAll - виконати код після всіх тестів

**beforeAll** буде виконано на початку файлу, так і на початку набору тестів, залежно від того в якому місці він об’явлений.

```javascript
beforeAll(() => {
    // Буде виконано на початку файла
})


describe(``, () => {
    beforeAll(() => {
        // Буде виконано на початку набора тестів
    })


    it(...)
})
```

**beforeEach** буде виконано перед усіма тестами в файлі, якщо він об’явлений на початку файлу, або перед кожним тестом в наборі, якщо він об’явлений в середині функції **describe**.

```javascript
beforeEach(() => {
    // Буде виконано перед кожним тестом в файлі
})


describe(``, () => {
    beforeEach (() => {
        // Буде виконано перед кожним тестом 
        // в поточному наборі тестів
    })


    it(...)
})
```

**afterEach** буде виконано після усіх тестів у файлі, якщо він об’явлений на початку файлу, або після кожного тесту в наборі, якщо він об’явлений в середині функції **describe**.

**afterAll** буде виконано або після тестів в наборі, або на при кінці файлу.

Виклики цих функцій можна комбінувати в одному файлі як глобально, так і локально для конкретного describe.

Створювач черги гарантує, що тести та функції встановлення та демонтажу будуть виконані саме в тому порядку, як вони зазначені.

#### Виконувач тестів

Після того, як чергу виконання створено, вона передається на виконання виконувачу тестів. Виконувач тестів виконує тести, враховуючи функції установки та демонтажу. Кожен тест це набір очікувань (expects), які треба виконати. Невиконання будь-якого очікування (expect) приводить до припинення подальшої обробки відповідного тесту (it, test).

#### Модуль Assertion

Виконувач тестів використовує виклики модуля Assertion для обчислення очікувань. Запуск очікування використовується за допомогою функції expect з передачею в цю функцію значення, яке необхідно перевірити. Функція expect повертає об’єкт Expect, який містить набір matchers - функцій перевірки. Функції перевірки можуть приймати контрольне значення з яким проводиться зіставлення та користувацьке повідомлення на випадок, якщо перевірку не пройдено. На зараз об’єкт Expect містить понад 100 вбудованих функцій перевірки. Це і просте зіставлення, і суворе, і перевірка структур об’єктів і перевірка масивів (наприклад на унікальність). До речі, якщо вам недостатньо цих функцій, ви з легкістю можете додати власні. Про це буде далі.

Якщо перевірку не пройдено, функція перевірки формує Throw exception з відповідним повідомленням та значеннями які зіставлялися та припиняє виконання поточного тесту і цей тест тепер вважається проваленим.

#### Інструменти Mocking

Функції-імітації (mocking functions) значно спрощують тестування пов’язаного коду, надаючи можливість стирати справжню імплементацію функції, записувати виклики функції (і параметри, які були їй передані), записувати екземпляри, які повертає функція-конструктор, викликана з допомогою оператора new і вказувати значення, які має повернути функція під час тестування.

Наразі фреймворк підтримує створення mock функції за допомогою фабричного методу mocker(). За допомогою цих функцій ви можете тестувати виклики, та передавання параметрів.

```javascript
describe(`Test mocking`, () => {
    const mock = mocker()
    mock()
    expect(mock).toHaveBeenCalled()
})
```

#### Профайлер для генерування звіту про покриття коду тестами

Якщо ввімкнуто функцію генерації звіту про покриття коду тестами за допомогою параметра coverage (cli аргумент --coverage), фреймворк після виконання тестів, формує звіт щодо кількісного покриття коду тестами. Вбудований репортер створить файл звіту в форматі LCOV. Який можна, наприклад, завантажити в CODECOV.

Профайлер у своїй роботі використовує модуль node:inspector. Модуль node:inspector надає API для взаємодії з інспектором V8. Що своєю чергою дає можливість отримати звіт щодо використання тестуємого коду.

Після того, як профайлер сформував звіт покриття, цей звіт передається в модуль генерації LCOV файлу. Згенерований файл може бути використаний з будь-яким інструментом аналізу покриття коду, який вміє працювати з форматом LCOV, наприклад CODECOV.

### Встановлення
Щоб встановити фреймворк потрібно виконати команду 
```bash
npm i -D @olton/easytest
```

Створимо перший простий тест (наприклад в каталозі __tests__/simple.test.js):

```javascript
import { describe, it, expect } from '@olton/easytest';

describe('My Tests', () => {
   it('should 1 === 1', () => {
       expect(1).toBe(1);
   });
});
```
> До речі можна не імпортувати describe, it, test та expect, бо вони доступні в глобальному контексті.  

### Налаштування
EasyTest розроблений як config-free фреймворк, тобто для своєї роботи він не потребує обов’язкового створення конфігураційного файлу. За замовченням використовуються такі параметри:

```json
{
   include: [
        "**/*.spec.{t,j}s", 
        "**/*.spec.{t,j}sx", 
        "**/*.test.{t,j}s", 
        "**/*.test.{t,j}sx"
   ],
   exclude: ["node_modules/**"],
   coverage: false,
   verbose: false,
   report: {
       type: "lcov",
       dir: "coverage"
   }
}
```

Щоб змінити параметр за замовченням, ви можете створити файл конфігурації з ім’ям easytest.json (або будь-яким іншим ім’ям, але тоді необхідно буде про це сказати фреймворку за допомогою cli аргументу **--config**).

### Запуск тестів
Щоб запустити easytest необхідно виконати команду:
```bash
npx easytest
```

або додати в package.json

```json
{
   "scripts": {
       "test": "easytest"
   }
}
```

і потім використовувати команду:

```bash
npm test  
```

### Аргументи командного рядка

- **--config=config_file_name.json** - шлях до користувацького конфігураційного файлу
- **--verbose** - багатослівність або детальний лог виконання (наразі вивід відбувається в консоль)
- **--coverage** - сформувати звіт покриття коду тестами
- **--test='...'** -  виконати лише тести, ім’я яких збігатися із вказаним шаблоном
- **--include=’...’**  - де шукати тести
- **--exclude=’...’**  - які файли або теки не враховувати при пошуку тестів

### Підтримка TypeScript

Щоб додати підтримку тестування TypeScript коду необхідно встановити модуль tsx.

```bash
npm i -D tsx cross-env
```

> cross-env додасть можливість міжплатформового встановлення змінної NODE_OPTIONS.

Щоб використати можливості tsx необхідно додати змінну оточення NODE_OPTIONS зі значенням “–import tsx”. Змінить команду запуску easytest:

```json
{
   "scripts": {
       "test": "cross-env NODE_OPTIONS='--import tsx' easytest"
   }
}
```

Це все, що потрібно зробити для тестування коду, написаного на TypeScript та написання тестів на TypeScript.

### Вивантаження звіту на зовнішній ресурс

Нижче наведено приклад GitHub автоматизації для автоматичного тестування коду при push та вивантаження звіту на CODECOV

```yaml
name: Run tests and upload coverage

on:
 push


jobs:
 test:
   name: Run tests and collect coverage
   runs-on: ubuntu-latest
   strategy:
     matrix:
       node-version: [ '22.x' ]
   steps:
     - name: Checkout
       uses: actions/checkout@v4
       with:
         fetch-depth: 0
     - name: Set up Node
       uses: actions/setup-node@v4
       with:
         node-version: ${{ matrix.node-version }}
     - name: Install dependencies
       run: npm install
     - name: Run tests
       run: easytest --coverage
     - name: Upload results to Codecov
       uses: codecov/codecov-action@v4
       with:
         token: ${{ secrets.CODECOV_TOKEN }}
```

Результат на CODECOV

![codecov](/images/blog/codecov-easytest.jpg)

### Розширення функціонала

Якщо вам з якихось причин не вистачає вбудованих матчерів (функцій перевірок), ви легко можете додати власні:

```javascript
import {Expect, ExpectError} from "@olton/easytest";

class MyExpect extends Expect {
    toBeEven() {
       let received = this.received
       let result = received % 2 === 0
       if (!result) {
           throw new ExpectError(`Expected ${received} to be even`, ‘toBeEven’, received, ‘Even’)
       }
    }
}

const expect = (received) => new MyExpect(received)

test(`Custom expect`, () => {
    expect(2).toBeEven()
})
```

### Тестування HTML UI
Ви можете використовувати EasyTest для перевірки компонентів інтерфейсу користувача. У цьому прикладі я тестую акордеонний компонент Metro UI.

```javascript
import fs from "fs";
import {beforeAll, describe, it, expect} from "@olton/easytest";

beforeAll(() => {
   window.METRO_DISABLE_BANNER = true;
   window.METRO_DISABLE_LIB_INFO = true;
   document.body.innerHTML = `
   <div id="accordion">
       <div class="frame">
           <div class="heading">Heading</div>
           <div class="content">Content</div>
       </div>
   </div>
`


   window.eval(fs.readFileSync('./lib/metro.js', 'utf8'))
})

describe(`Accordion tests`, () => {
   it(`Create accordion`, async () => {
       const accordion = window.Metro.makePlugin("#accordion", 'accordion')[0]
       expect(accordion).hasClass('accordion')
   })
})
```

Ще більше тестів ви знайдете за посиланням: https://github.com/olton/easytest/tree/master/__tests__

## Висновок
Проєкт вийшов дуже цікавим, дозволив отримати нові знання та поглибити наявні навички в JavaScript.

Посилання на GitHub - https://github.com/olton/easytest

> Проєкт зараз находиться в активній розробці.

