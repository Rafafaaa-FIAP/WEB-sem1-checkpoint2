const prompt = require('prompt-sync')()

let showError = false;

const options = [
    { id: '1', name: 'Cadastrar Produto' },
    { id: '2', name: 'Fazer Pedido' },
    { id: '3', name: 'Sair' }
];

const products = [];

initializeSystem();

function initializeSystem() {
    console.log('Bem-vindo ao sistema da padoca da vila!\n');

    let option = returnOption();
    
    while (option !== '3') {
        if (option !== '') {
            console.log('\n-----> ' + options.find(x => x.id === option).name + ' <-----\n');

            if (option === '1') {
                const name = prompt('Digite o nome do produto: ');

                showError = false;
                let price = NaN;
                while (isNaN(price)) {
                    if (showError) {
                        console.log('Digite um número!');
                    }
                    price = parseFloat(prompt('Digite o preço do produto: '));
                    showError = true;
                }

                showError = false;
                let quantity_stock = NaN;
                while (isNaN(quantity_stock)) {
                    if (showError) {
                        console.log('Digite um número!');
                    }
                    quantity_stock = parseInt(prompt('Digite a quantidade em estoque do produto: '));
                    showError = true;
                }

                createProduct(name, price, quantity_stock);
            }
            else if (option === '2') {
                if (products.length === 0) {
                    console.log('nao existe produto cadastrado!');
                }
                else {
                    const order = [];

                    while (true) {
                        const product = choiceProduct();

                        showError = false;
                        let quantity = NaN;
                        while (isNaN(quantity)) {
                            if (showError) {
                                console.log('Digite um número!');
                            }
                            quantity = parseInt(prompt('Digite a quantidade: '));
                            showError = true;

                            if (!verifyHasQuantityInStock(product, returnQuantityOfProductInOrder(order, product) + quantity)) {
                                console.log('Não há essa quantidade em estoque!');
                                quantity = NaN;
                                showError = false;
                            }
                        }

                        order.push({
                            product,
                            quantity
                        });

                        console.log('\n');
                        showError = false;
                        let moreProducts = '';
                        while (moreProducts !== 'sim' && moreProducts !== 'nao') {
                            if (showError) {
                                console.log('Opção inválida!');
                            }
                            moreProducts = prompt('Deseja adicionar mais produtos? (sim/nao): ');
                            showError = true;
                        }

                        if (moreProducts === 'nao'){
                            break;
                        }
                    }

                    for (let i = 0; i < products.length; i++) {
                        products[i].quantity_stock -= order.filter(x => x.product.name === products[i].name)
                            .reduce((a, c) => a + c.quantity, 0);
                    }

                    console.log(`Obrigado pela sua compra. Total do pedio: R$ ${order.reduce((a, c) => a + (c.product.price * c.quantity), 0)}`)
                }
            }
        }

        option = returnOption();
    }

    console.log('\nObrigado por ter utilizado o sistema da padoca da vila!');
}

function returnOption() {
    console.log('\n');
    for (let i = 0; i < options.length; i++) {
        console.log(`${options[i].id} - ${options[i].name}`);
    }

    const value = prompt('Escolha uma opção: ');
    
    if (!options.some(x => x.id === value)) {
        console.log('Opção inválida!');
        return '';
    }
    else {
        return value;
    }
}

function createProduct(name, price, quantity_stock) {
    if (products.some(x => x.name === name)) {
        showError = false;
        let addStock = '';
        while (addStock !== 'sim' && addStock !== 'nao') {
            if (showError) {
                console.log('Opção inválida!');
            }
            addStock = prompt('Produto já existe. Deseja apenas adicionar a quantidade ao estoque? (sim/nao): ');
            showError = true;
        }

        if (addStock === 'sim') {
            products.find(x => x.name === name).quantity_stock += quantity_stock;
        }
    }
    else {
        products.push({
            name,
            price,
            quantity_stock
        });
    }
}

function choiceProduct() {
    console.log('\n');
    for (let i = 0; i < products.length; i++) {
        console.log(`${products[i].name} - R$ ${products[i].price} - Quantidade em estoque: ${products[i].quantity_stock}`);
    }
    console.log('\n');
    let value = '';
    showError = false;
    while (!products.some(x => x.name === value)) {
        if (showError) {
            console.log('Produto inválido!');
        }
        value = prompt('Escolha um produto: ');
        showError = true;
    }

    return products.find(x => x.name === value);
}

function verifyHasQuantityInStock(product, quantity) {
    return products.find(x => x.name === product.name).quantity_stock >= quantity;
}

function returnQuantityOfProductInOrder(order, product) {
    return order.filter(x => x.product.name === product.name).reduce((a, c) => a + c.quantity, 0);
}