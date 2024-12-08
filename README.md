# Tiny

## Introduction

* Tiny is a simple server-side tool library based on Node+Typescript+Koa2/ecosystem, with core code of less than 20K. It provides many interesting classes and decorators that can help you save time on configuring routes, validating parameters, setting login states, writing API documentation, and other additional functionalities.

* Tiny aims to provide a simple tool library for developers, without involving deployment or operational content.

## Environment

![NODE Version][node-image]
![NPM Version][npm-image]

[node-image]: https://camo.githubusercontent.com/48b3dcbb1bdec68f5587b58f71e7165fd5b624e01c8ba350369873da6e32cb56/68747470733a2f2f696d672e736869656c64732e696f2f6e6f64652f762f6d7174742e737667

[npm-image]: https://camo.githubusercontent.com/b133c2aa426b98acd72f5aa52d309ba036a825616acf8994f1f2e115dbffe965/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f6d7174742e7376673f6c6f676f3d6e706d

## Directory

- [Introduction](#Introduction)
- [Environment](#Environment)
- [Directory](#Directory)
- [Installation](#Installation)
- [Usage](#Usage)
- [API Description](#API Description)
  - [Controller](#Controller)
    - [Controller](#Controller)
    - [Get](#Get)
    - [Delete](#Delete)
    - [Post](#Post)
    - [Put](#Put)
    - [View](#View)
    - [Json](#Json)
    - [Text](#Text)
    - [FormUrlencoded](#FormUrlencoded)
    - [FormData](#FormData)
    - [Other](#Other)
    - [Prefix](#Prefix)
    - [Mapping](#Mapping)
    - [Summary](#Summary)
  - [Model](#Model)
    - [Model](#Model)
    - [ModelResult](#ModelResult)
    - [Declare](#Declare)
    - [Required](#Required)
    - [TypeCheck](#TypeCheck)
    - [ArrayCheck](#ArrayCheck)
    - [StringLength](#StringLength)
  - [Params](#Params)
    - [Params](#Result)
    - [Result](#Result)
  - [Jwt](#Jwt)
    - [Jwt](#Jwt)
    - [Protected](#Protected)
  - [Dto](#Dto)
    - [Dto](#Dto)
    - [DtoCtxExtend](#DtoCtxExtend)
  - [Values](#Values)
    - [MethodType](#MethodType)
    - [DataType](#DataType)
    - [ParamsSource](#ParamsSource)
    - [ParamsType](#ParamsType)
    - [StatusCode](#StatusCode)
- [Others](#Others)

## Installation

* Before installation, please download and install Node.js. Node.js version 16.0.0 or higher is required.

### Creating a Tiny Application

* You can create a project based on Tiny using the project template provided by Tiny, which sets up a simple project structure for your reference.

```shell
npm create koa-tiny <project-name>
```

### Install Tiny in an existing project

```shell
npm install --save koa-tiny
```

### View current API information

* If the project is built using Tiny templates, you can access`/doc.html`the address to view the simplest API information

## Usage

### First-time usage example

* File`index.ts`

```typescript
import Tiny, { Controller } from 'koa-tiny';
import Koa from 'koa';
import Router from '@koa/router';
import { Manager } from '@/controller/manager';

const app = new Koa();
const router = new Router();

// 初始化配置
Tiny.init({
  controller: { prefix: '/api/' },
  jwt: { expiresIn: '4h', jsonwebtoken: jsonwebtoken }
});

// 连接你的控制器
Controller.connect<Manager>(new Manager(), router);

app.listen(4000);
```

* File`@/controller/manager.ts`

```typescript
import { Json, Summary, Dto, StatusCode, Get } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Get()
  @Json()
  @Summary('This is a summary')
  public async index(ctx: ExtendableContext, next: Next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'hello word', msg: 'success' });
    return next();
  }
}
```

* `InitOptions`Parameter description

```typescript
interface InitOptions {
  // 控制器配置参数
  controller?: ControllerOptionsInput;
  // jwt配置参数
  jwt?: JwtOptionsInput;
}
```

* For configuration information of ControllerOptionsInput, see:[Controller](#Controller)
* For configuration information of JwtOptionsInput, see:[Jwt](#Jwt)

## API Description

### Controller

#### Controller

* Usage`Controller.connect<T>(instance: T, router: Router)`Controller class for connecting to the system

```typescript
// 连接你的控制器
Controller.connect<Manager>(new Manager(), router);
```

* Usage`Controller.options: ControllerOptionsInput`Get controller configuration items

```typescript
// 打印配置
console.log(Controller.options)

// 配置类型
type ControllerOptionsInput = {
  // API前缀-全局，默认：''
  prefix?: string;
  // 是否是驼峰，默认：false
  hump?: boolean;
};
```

* Usage`Controller.apiInfoJson`Get JSON information of the API

```typescript
// 打印JSON信息
console.log(Controller.apiInfoJson)
```

* Usage`Controller.jwtProtectedList`Get the list of routes protected by JWT

```typescript
// 打印列表信息
console.log(Controller.jwtProtectedList)
```

#### Get

* Usage`@Get()`Decorator to declare a Get method

```typescript
import { Get } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Get()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Delete

* Usage`@Delete()`Decorator to declare a Delete method

```typescript
import { Delete } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Delete()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Post

* Usage`@Post()`Decorator to declare a Post method

```typescript
import { Post } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Put

* Usage`@Put()`Decorator to declare a Put method

```typescript
import { Put } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Put()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### View

* Usage`@View()`Decorator to declare a View method

```typescript
import { View } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @View()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Json

* Usage`@Json(handler?: Router.Middleware)`Decorator, declare the data type of the Body

```typescript
import { Post, Json } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  @Json()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Text

* Usage`@Text(handler?: Router.Middleware)`Decorator, declare the data type of the Body

```typescript
import { Post, Text } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  @Text()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### FormUrlencoded

* Usage`@FormUrlencoded(handler?: Router.Middleware)`Decorator, declare the data type of the Body

```typescript
import { Post, FormUrlencoded } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  @FormUrlencoded()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### FormData

* Usage`@FormData(handler?: Router.Middleware)`Decorator, declare the data type of the Body

```typescript
import { Post, FormData } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  @FormData()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Other

* Usage`@Other(handler?: Router.Middleware)`Decorator, declare the data type of the Body

```typescript
import { Post, Other } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  @Other()
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Prefix

* Usage`@Prefix(text: string)`Decorator, set the prefix for a single route

```typescript
import { Post, Prefix } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  @Prefix('/test/')
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Mapping

* Usage`@Mapping(path: string)`Decorator, reset the route address

```typescript
import { Post, Prefix } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  @Prefix('/manager/test/:id')
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

#### Summary

* Usage`@Summary(text: string)`Decorator, set the description for the method

```typescript
import { Post, Summary } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

export class Manager {
  @Post()
  @Summary('测试方法')
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
  }
}
```

## Model

#### Model

* Usage`model<Model>.fill(map: object)`Fill data model

```typescript
class LoginInput extends Model {
  @Declare()
  name!: string;

  @Declare()
  password!: string;
}

const input = new LoginInput();
const result: ModelResult = input.fill({...});
if(result.valid) {
  // ...
}
```

* Usage`model<Model>.getConfigCache`Get current model configuration

```typescript
const input = new LoginInput();
console.log(input.getConfigCache())
```

##### ModelResult

* Usage`new ModelResult(valid: boolean, message?: string, value?: any)`Set model validation result

#### Declare

* Usage`@Declare(description?: string)`Decorator, declare parameters, note: model parameters must be used at least`Declare`

```typescript
class LoginInput extends Model {
  @Declare()
  name!: string;
}
```

#### Required

* Usage`@Required(message?: string)`Decorator, set properties must

```typescript
class LoginInput extends Model {
  @Declare()
  @Required('名称不能唯空')
  name!: string;
}
```

#### TypeCheck

* Usage`@TypeCheck(type: ParamsType | T, message?: string)`Decorator, set type checking

```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.string, '名称只能为字符串')
  name!: string;
}
```

#### ArrayCheck

* Usage`@ArrayCheck(type: ParamsType | T, message?: string, maxLength?: number)`Decorator, set array type checking, precondition is`TypeCheck`Set`ParamsType.array`

```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.array, '列表只能为数组')
  @ArrayCheck(ParamsType.string, '数组内容只能为字符串')
  list!: string[];
}
```

#### StringLength

* Usage`@StringLength(range: number[], message?: string)`Decorator, set string length validation, precondition is`TypeCheck`Set`ParamsType.string`

```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.string, '名称只能为字符串')
  @StringLength([1,50], '名称长度只能为1-50')
  name!: string;
}
```

### Params

#### Params

* Usage`@Params<T extends Model>(params: { new (): T }, type: ParamsSource, validate: boolean = true, handler?: <P1, P2>(p1: P1, p2: P2) => T)`Decorator, set input parameter validation

```typescript
import { Post, Params } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

class LoginInput extends Model {
  @Declare()
  name!: string;

  @Declare()
  password!: string;
}

export class Manager {
  @Post()
  @Params(LoginInput, ParamsSource.body)
  public async index(ctx: ExtendableContext, next: Next, extend: DtoCtxExtend<LoginInput, null>) {
    console.log(extend.params.name)
    console.log(extend.params.password)
    // ...
  }
}
```

#### Result

* Usage`@Result<T extends Model>(result: { new (): T })`Decorator, set output parameter type

```typescript
import { Post, Params, Dto, StatusCode } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';

class LoginOut extends Model {
  @Declare()
  id!: string;

  @Declare()
  name!: string;
}

export class Manager {
  @Post()
  @Result(LoginOut)
  public async index(ctx: ExtendableContext, next: Next) {
    // ...
    const info = new LoginOut();
    info.fill({...});
    ctx.body = new Dto({ code: StatusCode.success, result: info, msg: 'success' });
  }
}
```

### Jwt

#### Jwt

* Usage`Jwt.sign<T>(ctx: ExtendableContext, payload: T)`Generate token

```typescript
Jwt.sign<JwtPayload>(ctx, {...});
```

* Usage`Jwt.verify<T>(ctx: ExtendableContext): T | null`Validate token

```typescript
const payload = Jwt.verify(ctx);
```

* Usage`Jwt.options`Get controller configuration items

```typescript
// 打印配置
console.log(Jwt.options)

// 配置信息
type JwtOptionsInput = {
  // jsonwebtoken类，详见：https://github.com/auth0/node-jsonwebtoken
  jsonwebtoken: {
    verify: Function;
    sign: Function;
  };
  // 私钥key，默认：'shared-secret'
  privateKey?: string;
  // 算法名称，默认：HS256
  algorithms?: string;
  // 过期时间，默认：24h
  expiresIn?: string;
  // 不验证令牌的过期时间，默认：false
  ignoreExpiration?: boolean;
  // 验证不通过返回的错误码，默认：408
  errorCode?: number;
  // 验证不通过返回的错误信息，默认：Unauthorized access
  errorMsg?: string;
  // 保存token的key：'token'
  tokenKey?: string;
  // 自定义获取token的方法
  getToken?: (ctx: ExtendableContext) => string | undefined;
  // 自定义设置token的方法
  setToken?: (ctx: ExtendableContext, value: string) => any;
  // 自定义是否重置token
  isResetToken?: (ctx: ExtendableContext) => boolean;
};
```

#### Protected

* Usage`@Protected()`Decorator, the configured method will perform JWT validation

```typescript
import { Post, Protected } from 'koa-tiny';
import { ExtendableContext, Next } from 'koa';
import { YouPayload } from '....'

export class Manager {
  @Post()
  @Protected()
  public async index(ctx: ExtendableContext, next: Next, extend: DtoCtxExtend<null, YouPayload>) {
    console.log(extend.payload)
    // ...
  }
}
```

### Dto

#### Dto

* Usage`new Dto({ code: number | string, result?: any, msg?: string })`Set Response return code

#### DtoCtxExtend

* Usage`new DtoCtxExtend<P1,P2>({ params: P1, payload: P2 })`Set ctx additional parameters (for internal use in Tiny)

### Values

#### MethodType

* Request type

```typescript
export enum MethodType {
  get = 'get',
  delete = 'delete',
  post = 'post',
  put = 'put',
  view = 'view'
}
```

#### DataType

* Data structure type of the body

```typescript
export enum DataType {
  json = 'application/json',
  text = 'text/plain',
  formUrlencoded = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data',
  other = 'other'
}
```

#### ParamsSource

* Parameter source

```typescript
export enum ParamsSource {
  query = 'query',
  body = 'body'
}
```

#### ParamsType

* Parameter data type

```typescript
export enum ParamsType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  array = 'array'
}
```

#### StatusCode

* Response status value

```typescript
export const StatusCode = {
  success: 200,
  paramsError: 400,
  authError: 408,
  serveError: 500
};
```

## Others
