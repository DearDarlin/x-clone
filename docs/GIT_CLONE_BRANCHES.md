# Як підтягнути всі гілки з GitHub після git clone

Після клонування в тебе зазвичай тільки:
- локальна гілка `master` (або `main`)
- налаштований `origin` на GitHub

---

## 1. Оновити інформацію про віддалені гілки

У корені проекту:

```bash
git fetch origin
```

Це підтягне **всі гілки з GitHub**, але локально вони ще не створені — вони існують як `origin/ім'я-гілки`.

Перевірити:

```bash
git branch -a
```

Побачиш щось типу:

```text
* master
  remotes/origin/master
  remotes/origin/dmitry
  remotes/origin/yaroslav
  remotes/origin/darina
  remotes/origin/stanislav
```

---

## 2. Створити локальну гілку з віддаленої

Для кожної потрібної гілки:

```bash
git checkout -b dmitry origin/dmitry
git checkout -b yaroslav origin/yaroslav
git checkout -b darina origin/darina
git checkout -b stanislav origin/stanislav
```

Після цього:

```bash
git branch
```

Бачиш вже **локальні** гілки:

```text
  dmitry
  yaroslav
  darina
  stanislav
* master
```

---

## 3. Далі працюєш як завжди

Наприклад, щоб працювати в `dmitry`:

```bash
git checkout dmitry
# ... зміни ...
git add .
git commit -m "..."
git push origin dmitry
```

---

## Швидка шпаргалка

```bash
# 1. Після клонування — отримати інфо про всі гілки
git fetch origin

# 2. Подивитися всі гілки (локальні + віддалені)
git branch -a

# 3. Створити локальну гілку з віддаленої
git checkout -b <назва-гілки> origin/<назва-гілки>

# 4. Перевірити локальні гілки
git branch
```
