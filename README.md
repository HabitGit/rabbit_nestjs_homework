<p><h1>Микросервисы</h1></p>

<ul type='circle'>
<li><h1>Первое приложение USERS включает регистрацию и обращается к profile</h1></li>
<li>модуль auth отвечает за регистрацию, которая разбита на 2 сервиса. Внутренний создает 
user аккаунт и сохранение аватара, внешний в приложении Profiles создает профиль.</li>
<li>В модуле users удаление юзера обращается в приложению Profile и удаляет профиль.</li>
<li>В модуле Users добавлен эндпоинт для получения списка всех профилей, обращение в приложению Profiles</li>
<li>В модуле Users добавлен эндпоинт для поиска профиля по id юзера</li>
<li>В модуле Users добавлен эндпоинт для обновления профиля по id юзера, обращение в приложение profiles</li>
<li>Все упаковано в докер и работает</li>
</ul>






