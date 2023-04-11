import * as request from "supertest";
import {HttpStatus} from "@nestjs/common";

`***
*Тесты модуля авторизации
*1. Тест на регистрацию пользователя
*2. Проверка что такой пользователь уже имеется в БД и создание невозможно
*3. Логин этого же пользователя
*4. После тестов удаление пользователя из БД
***`

describe('users controller', () => {
    let userDataLogin;
    let userDataRegistration;
    let user;
    let badUser
    let token;
    let accessToken;

    const url = `http://localhost:5000`;

    beforeAll(async () => {
        userDataRegistration = {
            email: 'testforchecktest@gmail.com',
            password: '12345',
            lastName: 'test',
            firstName: 'test',
            telNumber: '123123'
        }
    });

    it('/POST registration',  () => {
        return request(url)
            .post('/auth/registration')
            .set("Accept", 'application/json') // устанавливает значение в респонс, 1 - поле 2 - значение
            .send(userDataRegistration)
            .expect((response: request.Response) => { // получение респонса через данную функцию
                 user = response.body;
            }).expect(HttpStatus.CREATED)
    });

    it('/POST have this user?',  () => {
        return request(url)
            .post('/auth/registration')
            .set("Accept", 'application/json')
            .send(userDataRegistration)
            .expect((response: request.Response) => {
                badUser = response.body;
                expect(badUser.statusCode).toBe(HttpStatus.BAD_REQUEST)
            })
    });

    it('/POST login',  () => {
        userDataLogin = {email: user.user.email, password: '12345'};
        return request(url)
            .post('/auth/login')
            .set("Accept", "application/json")
            .send(userDataLogin)
            .expect((response: request.Response) => {
                token = response.body;
                expect(token.user.email).toBe(user.user.email)
            }).expect(HttpStatus.CREATED)
    });

    afterAll(() => {
        accessToken = [`Bearer ${token.accessToken}`];
       return request(url)
            .delete(`/users/${token.user.id}`)
           .set("authorization", accessToken)
            .expect((response: request.Response) => {
                const deleteExpect = response.body;
            })
    });

})