# Tiny

## 介绍

* Tiny是一个简单的、基于Node+Typescript+Koa2/生态的服务端工具库，它的核心代码只有不到20K，它提供了许多有意思的类以及装饰器，可以帮助你节约配置路由、校验参数、设置登录状态、编写API文档的时间，以及其他额外的功能。

* Tiny旨在提供一个简单的工具库给开发者使用，不涉及部署、运维相关内容。

## 环境

![NODE Version][node-image]
![NPM Version][npm-image]

[node-image]: https://camo.githubusercontent.com/48b3dcbb1bdec68f5587b58f71e7165fd5b624e01c8ba350369873da6e32cb56/68747470733a2f2f696d672e736869656c64732e696f2f6e6f64652f762f6d7174742e737667
[npm-image]: https://camo.githubusercontent.com/b133c2aa426b98acd72f5aa52d309ba036a825616acf8994f1f2e115dbffe965/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f6d7174742e7376673f6c6f676f3d6e706d

## 目录

- [介绍](#介绍)
- [环境](#环境)
- [目录](#目录)
- [安装](#安装)
- [使用](#使用)
- [API描述](#API描述)
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
- [其他](#其他)

## 安装

* 安装之前，请下载并安装 Node.js。需要 Node.js V16.0.0 或更高版本。

### 创建一个Tiny应用

* 创建基于Tiny的项目可以使用Tiny提供的项目模版，该模版设置了简单的项目结构，可供您参考。

```shell
npm create koa-tiny <project-name>
```

### 在已有项目中安装Tiny

```shell
npm install --save koa-tiny
```

### 查看当前API信息
* 若是使用Tiny模版构建的项目，可以访问`/doc.html`地址查看最简单的API信息

## 使用

### 初次使用示例

* 文件`index.ts`
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
* 文件`@/controller/manager.ts`
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
* `InitOptions`参数说明
```typescript
interface InitOptions {
  // 控制器配置参数
  controller?: ControllerOptionsInput;
  // jwt配置参数
  jwt?: JwtOptionsInput;
}
```
* ControllerOptionsInput的配置信息详见：[Controller](#Controller)
* JwtOptionsInput的配置信息详见：[Jwt](#Jwt)

## API描述

### Controller

#### Controller

* 使用`Controller.connect<T>(instance: T, router: Router)`连接系统的控制器类
```typescript
// 连接你的控制器
Controller.connect<Manager>(new Manager(), router);
```
* 使用`Controller.options: ControllerOptionsInput`得到控制器配置项
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
* 使用`Controller.apiInfoJson`得到API的JSON信息
```typescript
// 打印JSON信息
console.log(Controller.apiInfoJson)
```
* 使用`Controller.jwtProtectedList`得到jwt受到保护的路由列表
```typescript
// 打印列表信息
console.log(Controller.jwtProtectedList)
```

#### Get

* 使用`@Get()`装饰器，声明一个Get方法
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

* 使用`@Delete()`装饰器，声明一个Delete方法
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

* 使用`@Post()`装饰器，声明一个Post方法
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

* 使用`@Put()`装饰器，声明一个Put方法
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

* 使用`@View()`装饰器，声明一个View方法
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

* 使用`@Json(handler?: Router.Middleware)`装饰器，声明Body的数据类型
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

* 使用`@Text(handler?: Router.Middleware)`装饰器，声明Body的数据类型
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

* 使用`@FormUrlencoded(handler?: Router.Middleware)`装饰器，声明Body的数据类型
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

* 使用`@FormData(handler?: Router.Middleware)`装饰器，声明Body的数据类型
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

* 使用`@Other(handler?: Router.Middleware)`装饰器，声明Body的数据类型
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

* 使用`@Prefix(text: string)`装饰器，设置单个路由的前缀
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

* 使用`@Mapping(path: string)`装饰器，重置路由地址
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

* 使用`@Summary(text: string)`装饰器，给方法设置说明文旦
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

* 使用`model<Model>.fill(map: object)`填充数据模型
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

* 使用`model<Model>.getConfigCache`获取当前模型配置
```typescript
const input = new LoginInput();
console.log(input.getConfigCache())
```

##### ModelResult

* 使用`new ModelResult(valid: boolean, message?: string, value?: any)`设置模型校验结果

#### Declare

* 使用`@Declare(description?: string)`装饰器，声明参数，注意：模型参数至少需要使用`Declare`
```typescript
class LoginInput extends Model {
  @Declare()
  name!: string;
}
```

#### Required

* 使用`@Required(message?: string)`装饰器，设置属性必须
```typescript
class LoginInput extends Model {
  @Declare()
  @Required('名称不能唯空')
  name!: string;
}
```

#### TypeCheck

* 使用`@TypeCheck(type: ParamsType | T, message?: string)`装饰器，设置类型检查
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.string, '名称只能为字符串')
  name!: string;
}
```

#### ArrayCheck

* 使用`@ArrayCheck(type: ParamsType | T, message?: string, maxLength?: number)`装饰器，设置数组类型检查，前置条件为`TypeCheck`设置`ParamsType.array`
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.array, '列表只能为数组')
  @ArrayCheck(ParamsType.string, '数组内容只能为字符串')
  list!: string[];
}
```

#### StringLength

* 使用`@StringLength(range: number[], message?: string)`装饰器，设置字符串长度校验，前置条件为`TypeCheck`设置`ParamsType.string`
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

* 使用`@Params<T extends Model>(params: { new (): T }, type: ParamsSource, validate: boolean = true, handler?: <P1, P2>(p1: P1, p2: P2) => T)`装饰器，设置入参校验
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

* 使用`@Result<T extends Model>(result: { new (): T })`装饰器，设置出参类型
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

* 使用`Jwt.sign<T>(ctx: ExtendableContext, payload: T)`生成token
```typescript
Jwt.sign<JwtPayload>(ctx, {...});
```
* 使用`Jwt.verify<T>(ctx: ExtendableContext): T | null`验证token
```typescript
const payload = Jwt.verify(ctx);
```
* 使用`Jwt.options`得到控制器配置项
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

* 使用`@Protected()`装饰器，配置后的方法将进行JWT验证
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

* 使用`new Dto({ code: number | string, result?: any, msg?: string })`设置Response返回码

#### DtoCtxExtend

* 使用`new DtoCtxExtend<P1,P2>({ params: P1, payload: P2 })`设置ctx额外参数(Tiny内部使用)

### Values

#### MethodType

* 请求类型
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

* body的数据结构类型
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

* 参数来源
```typescript
export enum ParamsSource {
  query = 'query',
  body = 'body'
}
```

#### ParamsType

* 参数数据类型
```typescript
export enum ParamsType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  array = 'array'
}
```

#### StatusCode

* Response状态值
```typescript
export const StatusCode = {
  success: 200,
  paramsError: 400,
  authError: 408,
  serveError: 500
};
```

## 其他


