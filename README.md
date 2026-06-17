# Corvette Store

Autodeploy verification note: GitHub -> Vercel integration connected.

Стартовый каркас сайта магазина оригинальной брендовой одежды `Corvette Store`.

## Что внутри

- `site/` — готовый фронтенд лендинга и каталога.
- `src/com/corvettestore/CorvetteStoreServer.java` — простой Java HTTP-сервер, который раздаёт сайт и API `/api/products`.
- `cpp/style_recommender.cpp` — заготовка C++ модуля под рекомендации или ранжирование товаров.

## Почему так

В текущем окружении есть только `Java Runtime`, но нет `javac`, `Maven` и `g++`, поэтому я подготовил проект как понятную основу:

- Java отвечает за веб-сервер и каталог.
- C++ выделен в отдельный модуль, который можно позже подключить как нативный сервис или вычислительный слой.

## Как запустить после установки JDK

Нужен JDK, чтобы появился `javac`.

```powershell
cd C:\Users\Illya\Documents\Codex\2026-06-09\corvette-store
mkdir out
javac -d out src\com\corvettestore\CorvetteStoreServer.java
java -cp out com.corvettestore.CorvetteStoreServer
```

После запуска сайт будет доступен на:

- `http://localhost:8080`

## Как собрать C++ модуль позже

После установки `g++`:

```powershell
g++ cpp\style_recommender.cpp -o work\style_recommender.exe
.\work\style_recommender.exe
```

## Следующие шаги

- добавить корзину и страницу товара;
- подключить реальную базу товаров;
- внедрить фильтры по размеру, бренду и цене;
- связать Java API с C++ движком рекомендаций.
