import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import * as process from "process";

@Injectable()
export class MailerService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({ // Создаем "транспортер", это то, откуда отправляются емэил
            host: process.env.SMTP_HOST, // Указываем хост сервиса SMTP
            port: process.env.SMTP_HOST, // Порт сервиса
        secure: true,
        auth: {
                user: process.env.SMTP_USER, // почта с которой отправляется мэил
                pass: process.env.SMTP_PASSWORD_posta // пароль от почты. В некоторых случаях это специальный пароль для сторонних приложений
        }
        })
    }

    async sendActivationMail(to, link) { // отправка почты
        await this.transporter.sendMail({
            from: 'igoren1@yandex.ru', // от кого
            to, // сюда передаем эмеил кому
            subject: `Activate account on suit ${process.env.API_URL}`, // заголовок
            text: '',
            html: // поле для HTML в котором ссылка на активацию
            `
            <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">${link}</a> 
</div>
            `
        })
    }
}
