# Certificate Issuer

## Descrição
Atualmente o processo de validacão de créditos da Universidade é muito burocrático. Temos uma enorme dependência em papéis e documentos que muitas vezes perdemos ao longo do curso, tanto quanto, uma dependência na secretaria do curso para a validação dos créditos de todos os estudantes.

O intuito desse projecto é utilizar os contratos inteligentes da rede distribuída do Ethereum para válidar certificados da Universidade. Assim podemos garantir que o certificado foi emitido por uma entidade específica, e também, garantir que os documentos não serão perdidos, pois ficaram distríbuidos na rede para sempre.

Atualmente o projeto esta funcionando para uma única entidade (Hackoonspace), mas o objetivo é aprimora-lo para pode ser utilizado por qualquer entidade.

OBS: os passos a seguir são para executar o contrato em uma rede local, mas o intuito é oficializa-lo na rede oficial do Ethereum.

## Como rodar
Primeiro certifique-se que tem o `Javascript` e o `Node` instalados na sua máquina. A versão do node utilizada no projeto é a `v16.19.1`.


1 - Garanta que está dentro da pasta raiz /cerificate-issuer, em seguida, instale as dependências dos módulos back-end e front-end;

``` bash
cd front-end
npm install

cd ../back-end
npm install
```


2- Para garantir que tudo está funcionando normalmente, dentro do caminho `/back-end`, execute o seguinte comando para compilar o contrato e realizar um teste de conexão com a Blockchain local.

``` bash
npx hardhat run scripts/run.js
```

Após rodar o comando deve aparecer um prompt similar a esse, podendo ter diferenças nos endereços printados.

```
Inicializando contrato.
Dono do contrato: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
[
  [
    BigNumber { value: "760921" },
    BigNumber { value: "60" },
    'Projeto BlockChain 1.0',
    'https://drive.google.com/file/d/1FBYXtkKDeTElFe5sYTc7mJDKLEXq8jTP/view?usp=share_link',
    BigNumber { value: "1680270798" },
    RA: BigNumber { value: "760921" },
    hoursDone: BigNumber { value: "60" },
    name: 'Projeto BlockChain 1.0',
    link: 'https://drive.google.com/file/d/1FBYXtkKDeTElFe5sYTc7mJDKLEXq8jTP/view?usp=share_link',
    issueDate: BigNumber { value: "1680270798" }
  ],
  ...
]
```

3- Se o comando anterior executar corretamente, suba uma rede Ethereum local com o comando:

``` bash
npx hardhat node
```

Esse comando irá printar uma lista de carteiras criadas pelo Hardhat, para conseguirmos testar o nosso contrato, e manterá uma rede local rodando enquanto o terminal não for finalizado.

4- Em outro terminal, continuando no caminho `/back-end`, faça o deploy do contrato na rede local:

``` bash
npx hardhat run scripts/deploy.js --network localhost
```

5- Faça a conexão entre a Metamask e a Blockchain local, e adicione a carteira #0 da Blockchain de teste na Metamask [seguindo esse tutorial](https://medium.com/@kaishinaw/connecting-metamask-with-a-local-hardhat-network-7d8cea604dc6):

OBS: Apenas quando for recriar a Blockchain local, é preciso resetar a Metamask, para isso siga os seguintes passos.

* Dentro da Metamask, clique na sua foto
* Va em Settings
* Va em Advanced
* Clique em Reset Account


6- Subir servidor do front-end:
```bash
cd ../front-end
npm run dev
```


7- Acessar pelo navegador o link http://localhost:5173/