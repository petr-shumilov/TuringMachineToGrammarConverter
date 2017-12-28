# Структура репозитория
* tm_to_gr_type0 - конвертер из LBA в грамматику типа 0
	1. generation.txt - вывод слова (простого числа)
	2. grammar0.txt - описание грамматики типа 0
	3. index.js - программа-конвертер МТ в грамматику соответсвующего типа 
	4. tm.src - описание LBA 
* tm_to_gr_type1 - конвертер из LBA в грамматику типа 1
	1. generation.txt - вывод слова (простого числа)
	2. grammar1.txt - описание грамматики типа 1
	3. index.js - программа-конвертер МТ в грамматику соответсвующего типа 
	4. tm.src - описание LBA 	
# Установка среды исполнения Node.js для ос Windows (необходима версия > 8.0.0)
1. Скачайте msi пакет, доступен на оф сайте: https://nodejs.org/en/download/
1. Установите (Далее -> ... -> Далее -> Готово)
# Как запустить 
1. Склонируйте репозиторий или скачайте архив и разархивируйте в любую удобную для Вас директоию (например: "C:/tmp/Shumilov&Volkov/") 
1. Найдите (через пуск или как-нибудь иначе) и запустите "node js command prompt" 
1. В открывшемся командном интерфейсе с помощью команд cd доберитесь до склонированного или распакованного репозитория
1. Выбирите тип конвертера (из LBA в тип 0 или тип 1) и перейдите в соответствующую директорию (например: "cd tm_to_gr_type0")
1. Выполните: node index.js  
1. Дождитесь вывода строчки "Done!"
1. Результат будет лежать в файле grammar0.txt или grammar1.txt 
