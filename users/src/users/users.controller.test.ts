import {ModuleMocker, MockFunctionMetadata} from 'jest-mock';
import {UsersController} from "./users.controller";
import {Test} from "@nestjs/testing";
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {AddRoleDto} from "./dto/add-role.dto";

const httpMocks = require("node-mocks-http");
const moduleMocker = new ModuleMocker(global);

`***
*Тест для юзер контроллера
*1. Мокается юзер сервис с функциями
*2. Эмулируется модель юзер приложения
*3. Тест на принадлежность контроллера к модулю
*4. Тест поина create
*5. Тест поинта получения юзеров
*6. Тест поинта удаления юзера
*7. Тест поинта выдачи роли
***`

describe('users controller', () => {
    let controller: UsersController;
    let dto: CreateUserDto;
    let dto2: CreateUserDto;
    let roleDto: AddRoleDto;
    let service: UsersService;

    const mockRequest = httpMocks.createRequest(); // Мокается реквест для создания фейкового юзера
    mockRequest.user = new CreateUserDto();
    mockRequest.user = "DUE";

    const mackUsersService = { // Мокается юзер сервис что бы функции могли быть прочитаны
        createUser: jest
            .fn()
            .mockImplementation(dto => {
                return {
                    id: Date.now(),
                    ...dto
                }
            }),

        getUsers: jest.fn(() => {
            return {
                obj: {dto, dto2}
            }
        }),

        deleteUser: jest.fn(() => {
            return [];
        }),

        addRole: jest
            .fn()
            .mockImplementation((roleDto: AddRoleDto) => {
                return {
                    ...roleDto,
                    role: 'ADMIN'
                }
            }),
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({ // Эмулируется модуль приложения юзерс
            controllers: [UsersController],
            providers: [UsersService],
        })
            .useMocker((token) => { // если есть много зависимостей, данный способ помогает не прописывать все
                const results = ['test1', 'test2'];
                if (token === UsersService) {
                    return { findAll: jest.fn().mockResolvedValue(results) };
                }
                if (typeof token === 'function') {
                    const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                    const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                    return new Mock();
                }
            })
            .overrideProvider(UsersService)
            .useValue(mackUsersService)
            .compile(); // подменяется реальный сервис за замоканый

        dto = {
            email: 'test',
            password: 'test',
            isActivated: false,
            activationLink: 'asd'};
        dto2 = {
            email: 'test2',
            password: 'test2',
            isActivated: true,
            activationLink: 'asd2'};
        roleDto = {
            value: 'ADMIN',
            userId: mockRequest.user.id,
        };

        service = moduleRef.get(UsersService); // вытаскиваются сервисы
        controller = moduleRef.get(UsersController);
    });


    it('controller defined', () => {
        expect(controller).toBeDefined();
    });

    it('Check create controller and work service', () => {
        expect(controller.create(dto)).toEqual({
            id: expect.any(Number),
            email: 'test',
            password: 'test',
            isActivated: false,
            activationLink: 'asd'
        });

        const spyServiceCreate = jest.spyOn(service, 'createUser'); // Спай для отслеживания конкретной функции
        expect(spyServiceCreate).toBeCalledTimes(1);
    });

    it('check get all users and service', () => {
        expect(controller.getAll()).toEqual({obj: {dto, dto2}});

        const spyServiceGetUsers = jest.spyOn(service, 'getUsers');
        expect(spyServiceGetUsers).toBeCalledTimes(1);
    });

    it('delete', () => {
        expect(controller.deleteUser('1', mockRequest.user)).toEqual([]);
        const spyServiceDeleteUser = jest.spyOn(service, 'deleteUser');
        expect(spyServiceDeleteUser).toBeCalledTimes(1);
    });

    it('add role', () => {
        expect(controller.addRole(roleDto)).toEqual({...roleDto, role: 'ADMIN'});
        const spyServiceAddRole = jest.spyOn(service, 'addRole');
        expect(spyServiceAddRole).toBeCalledTimes(1);

    });

})