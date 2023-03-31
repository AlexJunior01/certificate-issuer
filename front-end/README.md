## Running React on Repl.it

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces.

[Vite](https://vitejs.dev/) is a blazing fast frontend build tool that includes features like Hot Module Reloading (HMR), optimized builds, and TypeScript support out of the box.

Using the two in conjunction is one of the fastest ways to build a web app.

### Getting Started
- Hit run
- Edit [App.jsx](#src/App.jsx) and watch it live update!

By default, Replit runs the `dev` script, but you can configure it by changing the `run` field in the `.replit` file.

---- INIT ----
1- npm install back-end
2- npm install front-end

3- Testar a conexão com o comando:
cd back-end
npx hardhat run scripts/run.js

---- START ----
4- Se o comando anterior executar corretamente, suba a rede com o comando:
npx hardhat node

5- Fazer o deploy do contrato na rede:
npx hardhat run back-end/scripts/deploy.js --network localhost

6- Conexão entre a Metamask e a Blockchain local, e adicionar uma carteira da Blockchain de teste.
https://medium.com/@kaishinaw/connecting-metamask-with-a-local-hardhat-network-7d8cea604dc6
obs: Resetar a Metamask quando recriar a Blockchain local.
    - Dentro da Metamask, clique na sua foto
    - Va em Settings
    - Va em Advanced
    - Clique em Reset Account

7- Subir o front-end:
cd ..
cd front-end
npm run dev

9- Acessar o link
http://localhost:5173/