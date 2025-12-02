# Git Guide: Повний посібник для команди

> Команда: 4 розробники  
> Гілки: `master`, `dmitry`, `yaroslav`, `darina`, `stanislav`

---

## Зміст

1. [Структура гілок](#1-структура-гілок)
2. [Початок роботи (після clone)](#2-початок-роботи-після-clone)
3. [Щоденний робочий процес](#3-щоденний-робочий-процес)
4. [Pull Request (PR)](#4-pull-request-pr)
5. [Code Review](#5-code-review)
6. [Вирішення конфліктів](#6-вирішення-конфліктів)
7. [Правила команди](#7-правила-команди)
8. [Швидка шпаргалка](#8-швидка-шпаргалка)

---

## 1. Структура гілок

```
master (стабільний код)
   │
   ├── dmitry
   ├── yaroslav
   ├── darina
   └── stanislav
```

| Гілка | Призначення |
|-------|-------------|
| `master` | **Стабільна** версія. Сюди потрапляє лише перевірений код. |
| `dmitry`, `yaroslav`, `darina`, `stanislav` | **Персональні** гілки кожного розробника. |
| `feature/*`, `fix/*` | **Фіча-гілки** для окремих задач (опціонально). |

Кожен працює у **своїй гілці**, а потім через **Pull Request** вливає зміни в `master`.

---

## 2. Початок роботи (після clone)

### 2.1. Клонування репозиторію

```bash
git clone https://github.com/DearDarlin/x-clone.git
cd x-clone
```

### 2.2. Отримати всі гілки з GitHub

```bash
git fetch origin
```

### 2.3. Подивитися всі гілки

```bash
git branch -a
```

Побачиш:

```text
* master
  remotes/origin/master
  remotes/origin/dmitry
  remotes/origin/yaroslav
  remotes/origin/darina
  remotes/origin/stanislav
```

### 2.4. Створити локальну гілку з віддаленої

```bash
git checkout -b dmitry origin/dmitry
# або для інших:
git checkout -b yaroslav origin/yaroslav
git checkout -b darina origin/darina
git checkout -b stanislav origin/stanislav
```

### 2.5. Перевірити локальні гілки

```bash
git branch
```

---

## 3. Щоденний робочий процес

### 3.1. Початок робочого дня

**Завжди** синхронізуйся з останньою версією `master`:

```bash
# 1. Перейти на master і отримати останні зміни
git checkout master
git pull origin master

# 2. Повернутися на свою гілку
git checkout dmitry

# 3. Влити зміни з master у свою гілку
git merge master
```

**Навіщо?** Якщо хтось вже вмержив свої зміни в `master`, ти отримаєш їх і уникнеш конфліктів пізніше.

### 3.2. Робота над задачею

Пишеш код, тестуєш локально. Коли зробив щось логічно завершене — комітиш:

```bash
git add .
git commit -m "Add user profile page"
```

**Правила комітів:**
- Один коміт = одна логічна зміна
- Повідомлення коротке, але зрозуміле
- Приклади хороших повідомлень:
  - `"Add login form validation"`
  - `"Fix avatar upload bug"`
  - `"Update user schema"`

### 3.3. Пуш на GitHub

Наприкінці дня (або після кожної значної зміни):

```bash
git push origin dmitry
```

**Навіщо?**
- Бекап коду на сервері
- Інші бачать твій прогрес
- Можна створити Pull Request

---

## 4. Pull Request (PR)

### 4.1. Перед створенням PR — синхронізація

```bash
git checkout master
git pull origin master
git checkout <твоя-гілка>
git merge master
# вирішити конфлікти, якщо є
git push origin <твоя-гілка>
```

### 4.2. Створення PR на GitHub

1. Заходиш на GitHub → репозиторій → **Pull requests** → **New pull request**
2. Вибираєш:
   - **base:** `master` (куди вливаємо)
   - **compare:** `dmitry` (звідки вливаємо)
3. Пишеш опис: що зроблено, що тестував
4. Призначаєш **Reviewer** (хтось з команди)
5. Натискаєш **Create pull request**

### 4.3. Merge в master

Після **Approve** від рев'юера:

1. На GitHub в PR натискаєш **Merge pull request**
2. Вибираєш тип merge:
   - **Merge commit** — зберігає всю історію комітів з гілки
   - **Squash and merge** — об'єднує всі коміти в один чистий коміт
   - **Rebase and merge** — переписує історію без додаткового merge-коміту

**Рекомендація:** використовувати **Squash and merge** для чистої історії.
3. Натискаєш **Confirm merge**
4. Видаляєш гілку (GitHub запропонує)

### 4.4. Після merge — оновити локально

```bash
git checkout master
git pull origin master
git checkout dmitry
git merge master
```

---

## 5. Code Review

### 5.1. Якщо ти рев'юер

- Переглядаєш код на GitHub
- Залишаєш коментарі, якщо щось незрозуміло або можна покращити
- Перевіряєш:
  - Код працює і не ламає існуючий функціонал
  - Стиль коду відповідає проєкту
  - Немає очевидних багів
- Якщо все ок — натискаєш **Approve**
- Коментарі — конструктивні, без переходу на особистості

### 5.2. Якщо рев'юер залишив коментарі тобі

- Виправляєш код локально
- Комітиш і пушиш:
  ```bash
  git add .
  git commit -m "Fix review comments"
  git push origin dmitry
  ```
- PR оновиться автоматично

### 5.3. Як перевірити зміни іншого розробника локально

```bash
# 1. Отримати останні зміни
git fetch origin

# 2. Перейти в гілку іншого розробника
git checkout yaroslav
git pull origin yaroslav

# 3. Запустити і протестувати
npm install
npm start

# 4. Повернутись до своєї роботи
git checkout dmitry
```

---

## 6. Вирішення конфліктів

### 6.1. Коли виникають конфлікти?

- **Різні файли** — конфлікту НЕ буде, Git автоматично об'єднає
- **Один файл, різні місця** — конфлікту НЕ буде
- **Один файл, ті самі рядки** — КОНФЛІКТ

### 6.2. Золоте правило

> **Той, хто мержить другим — той і вирішує конфлікти.**

### 6.3. Як вирішити конфлікт

```bash
# 1. Оновити master
git checkout master
git pull origin master

# 2. Перейти на свою гілку і влити master
git checkout yaroslav
git merge master
```

Git покаже:

```
CONFLICT (content): Merge conflict in app/profile.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

### 6.4. Відкрити файл з конфліктом

```tsx
const userName = () => {
<<<<<<< HEAD
  return "Yaroslav's version";
=======
  return "Dmitry's version";  // це вже в master
>>>>>>> master
};
```

### 6.5. Вирішити конфлікт вручну

Вибрати правильний варіант (або об'єднати):

```tsx
const userName = () => {
  return "Dmitry's version";
};
```

### 6.6. Закомітити вирішення

```bash
git add .
git commit -m "Resolve merge conflict with master"
git push origin yaroslav
```

PR на GitHub оновиться автоматично.

### 6.7. Як уникнути конфліктів?

| Порада | Чому це працює |
|--------|----------------|
| Синхронізуватися з master щодня | Менше розбіжностей накопичується |
| Комунікація в команді | "Я працюю над profile.tsx" — інші знають |
| Менші PR | Легше мержити, менше шансів на конфлікт |
| Не відкладати merge надовго | Чим довше гілка живе окремо — тим більше конфліктів |

---

## 7. Правила команди

### 7.1. Заборонено

- ❌ `git push --force` в `master`
- ❌ Комітити напряму в `master` (без PR)
- ❌ Мержити свій PR без рев'ю
- ❌ Залишати незакомічені зміни надовго

### 7.2. Рекомендації

- ✅ Пушити свою гілку на GitHub щодня (бекап)
- ✅ Перед початком роботи — `git pull`
- ✅ Тестувати локально перед створенням PR

### 7.3. Комунікація

- **Щоденний статус** (коротко): що зробив, що планую, чи є блокери
- Використовувати **Issues / Tasks** для трекінгу задач
- Якщо конфлікт — вирішувати разом, не перезаписувати чужий код без узгодження

---

## 8. Швидка шпаргалка

### Після clone

```bash
git fetch origin
git branch -a
git checkout -b <гілка> origin/<гілка>
```

### Щоденна робота

```bash
# Ранок: синхронізація
git checkout master && git pull
git checkout dmitry && git merge master

# Робота: коміти
git add . && git commit -m "опис"

# Кінець дня: пуш
git push origin dmitry
```

### Pull Request

```bash
# Перед PR: синхронізація
git checkout master && git pull
git checkout dmitry && git merge master
git push origin dmitry

# Створити PR на GitHub: dmitry → master
# Після approve — merge через GitHub

# Після merge: оновити локально
git checkout master && git pull
```

### При конфлікті

```bash
git checkout master && git pull
git checkout <твоя-гілка>
git merge master
# Вирішити конфлікти в IDE (видалити маркери <<<, ===, >>>)
git add .
git commit -m "Resolve merge conflict"
git push origin <твоя-гілка>
```

### Перевірити гілку іншого розробника

```bash
git fetch origin
git checkout yaroslav
git pull origin yaroslav
# протестувати
git checkout dmitry  # повернутись
```
