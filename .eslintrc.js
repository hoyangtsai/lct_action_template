module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    // parser: '@typescript-eslint/parser'
  },
  extends: ['@tencent/eslint-config-tencent'],
  rules: {
    // 保留组内原有的规则
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'constructor-super': 'error',
    'for-direction': 'error', // 禁止 for 循环出现方向错误的循环，比如 for (i = 0; i < 10; i--)
    'getter-return': ['error', { allowImplicit: false }], // getter 必须有返回值，并且禁止返回空，比如 return;
    'no-case-declarations': 'error', // switch 的 case 内有变量定义的时候，必须使用大括号将 case 内变成一个代码块
    'no-class-assign': 'error', // 禁止对定义过的 class 重新赋值
    'no-compare-neg-zero': 'error', // 禁止与负零进行比较
    'no-cond-assign': ['error', 'except-parens'], // 禁止对使用 const 定义的常量重新赋值
    'no-const-assign': 'error', // 禁止对使用 const 定义的常量重新赋值
    'no-constant-condition': ['error', { checkLoops: false }], // 禁止将常量作为 if 或三元表达式的测试条件，比如 if (true), let foo = 0 ? 'foo' : 'bar'
    'no-control-regex': 'error', // 禁止在正则表达式中出现 Ctrl 键的 ASCII 表示，即禁止使用 /\x1f/
    'no-delete-var': 'error', // 禁止使用 delete
    'no-dupe-args': 'error', // 禁止在函数参数中出现重复名称的参数
    'no-dupe-keys': 'error', // 禁止在对象字面量中出现重复名称的键名
    'no-duplicate-case': 'error', // 禁止在 switch 语句中出现重复测试表达式的 case
    'no-empty': ['error', { allowEmptyCatch: true }], // 禁止出现空代码块
    'no-empty-character-class': 'error', // 禁止在正则表达式中使用空的字符集
    'no-empty-function': ['error', { allow: ['functions', 'arrowFunctions'] }],
    'no-empty-pattern': 'error',
    'no-ex-assign': 'error', // 禁止将 catch 的第一个参数 error 重新赋值
    'no-extra-boolean-cast': 'error', // 禁止在测试表达式中使用 Boolean
    'no-fallthrough': 'error', // switch 的 case 内必须有 break, return 或 throw
    'no-func-assign': 'error', // 禁止将一个函数申明重新赋值
    'no-global-assign': 'error', // 禁止对全局变量赋值
    'no-invalid-regexp': 'error', // 禁止出现非法的正则表达式
    'no-irregular-whitespace': [
      // 禁止使用特殊空白符（比如全角空格），除非是出现在字符串、正则表达式或模版字符串中
      'error',
      { skipComments: false, skipRegExps: true, skipStrings: true, skipTemplates: true },
    ],
    'no-new-symbol': 'error', // 禁止使用 new 来生成 Symbol
    'no-obj-calls': 'error', // 禁止将 Math, JSON 或 Reflect 直接作为函数调用，必须作为类使用
    'no-octal': 'error', // 禁止使用 0 开头的数字表示八进制数
    'no-redeclare': 'error', // 禁止重复定义变量
    'no-regex-spaces': 'error', // 禁止在正则表达式中出现连续的空格，必须使用 /foo {3}bar/ 代替
    'no-return-assign': ['error', 'always'], // 禁止在 return 语句里赋值
    // 'no-return-await': 'error', //禁止在 return 语句里使用 await
    'no-self-assign': 'error', // 禁止将自己赋值给自己
    'no-self-compare': 'error', // 禁止将自己与自己比较
    'no-shadow-restricted-names': 'error', // 禁止使用保留字作为变量名
    'no-sparse-arrays': 'error', // 禁止在数组中出现连续的逗号，如 let foo = [,,]
    'no-this-before-super': 'error', // 禁止在 super 被调用之前使用 this 或 super
    'no-unmodified-loop-condition': 'error', // 循环内必须对循环条件的变量有修改
    'no-unreachable': 'error', // 禁止在 return, throw, break 或 continue 之后还有代码
    'no-unsafe-finally': 'error', // 禁止在 finally 中出现 return, throw, break 或 continue
    'no-unsafe-negation': 'error', // 禁止在 in 或 instanceof 操作符的左侧使用感叹号，如 if (!key in object)
    'no-unused-labels': 'error', // 禁止出现没用的 label
    'no-param-reassign': 'off',
    'require-yield': 'error', // generator 函数内必须有 yield
    'use-isnan': 'error', // 必须使用 isNaN(foo) 而不是 foo === NaN
    'valid-typeof': 'error', // typeof 表达式比较的对象必须是 'undefined', 'object', 'boolean', 'number', 'string', 'function' 或 'symbol'
    yoda: ['error', 'never', { onlyEquality: true }], // 必须使用 if (foo === 5) 而不是 if (5 === foo)
    'accessor-pairs': ['error', { getWithoutSet: false, setWithoutGet: true }], // 有 setter 的地方必须有 getter，有 getter 的地方可以没有 setter
    'block-scoped-var': 'error',
    // complexity: ['error', { max: 20 }], //禁止函数的循环复杂度超过 20
    'no-caller': 'error', // 禁止使用 caller 或 callee
    'no-extra-bind': 'error', // 禁止出现没必要的 bind
    'no-extra-label': 'error', // 禁止出现没必要的 label
    'no-implicit-globals': 'error', // 禁止在全局作用域下定义变量或申明函数
    'no-implied-eval': 'error', // 禁止在 setTimeout 或 setInterval 中传入字符串，如 setTimeout('alert("Hi!")', 100);
    'no-labels': 'error', // 禁止使用 label
    'no-lone-blocks': 'error', // 禁止使用没必要的 {} 作为代码块
    'no-multi-str': 'error', // 禁止使用 \ 来换行字符串
    'no-new': 'error',
    'no-proto': 'error', // 禁止使用 __proto__
    'no-sequences': 'error', // 禁止使用逗号操作符
    'no-throw-literal': 'error', // 禁止 throw 字面量，必须 throw 一个 Error 对象
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTaggedTemplates: true, allowTernary: true }], // 禁止无用的表达式
    'no-void': 'error', // 禁止使用 void
    'no-with': 'error', // 禁止使用 with
    'no-use-before-define': ['error', { classes: false, functions: false, variables: false }], // 变量必须先定义后使用
    'no-useless-computed-key': 'error', // 禁止出现没必要的计算键名，比如 let a = { ['0']: 0 };
    'no-useless-rename': 'error', // 禁止解构时出现同样名字的的重命名，比如 let { foo: foo } = bar;
    'symbol-description': 'error', // 创建 Symbol 时必须传入参数
    'max-depth': ['error', 10],
    'max-nested-callbacks': ['error', 3],
    'new-cap': ['error', { capIsNew: false }], // 允许非new使用首字母大写（兼容ts修饰器）
    'func-style': ['off', 'expression', { allowArrowFunctions: true }], // 需要后续修改
    // 'max-len': ['error', { code: 120 }],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-trailing-spaces': 'off',
    // 暂时关闭
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'no-plusplus': 'off',
    complexity: 'off',
    'no-prototype-builtins': 'off',
    'no-return-await': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    "max-len": ["error", { "code": 120 }],
    'operator-linebreak': ["error", "before"]
  },
};
