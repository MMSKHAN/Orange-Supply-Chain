// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract SupplyChain {
    enum EntityType { Farmer, Wholesaler, Logistics, Retailer, Customer }
    
    address public owner;
    uint public id;  
    struct Entity {
        address Firmadd;
        string Firmname;
        string Firmlocation;
        string ownerName;
        string ownerContact;
        string city;
        EntityType entityType;
        bool isAllowed;
    }
    
    struct Product {
        uint id; 
        string variety;
        uint price;
        uint quantity;
        string dateOfHarvest;
        address currentOwner;
        address creator;
    }
    
    Product[] public products;
    Entity[] public entities;
    
    mapping(address => bool) private entityExists;
    mapping(address => bool) private entityAllowed;
    mapping(address => bool) private isFarmer;

    constructor() {
        owner = msg.sender;
        id = 0;
    }

    function setEntity(
        address _Firmadd,
        string memory _Firmname,
        string memory _Firmlocation,
        string memory _ownerName,
        string memory _ownerContact,
        string memory _city,
        EntityType _entityType
    ) public {
        require(msg.sender == owner, "Only owner can create entities");
        require(!entityExists[_Firmadd], "Entity already exists");

        entities.push(Entity({
            Firmadd: _Firmadd,
            Firmname: _Firmname,
            Firmlocation: _Firmlocation,
            ownerName: _ownerName,
            ownerContact: _ownerContact,
            city: _city,
            entityType: _entityType,
            isAllowed: true
        }));

        entityAllowed[_Firmadd] = true;
        entityExists[_Firmadd] = true;
        
        if (_entityType == EntityType.Farmer) {
            isFarmer[_Firmadd] = true;
        }
    }

    function allowEntity(address _Firmadd) public {
        require(msg.sender == owner, "Only owner can allow entities");
        entityAllowed[_Firmadd] = true;
    }

    function disallowEntity(address _Firmadd) public {
        require(msg.sender == owner, "Only owner can disallow entities");
        entityAllowed[_Firmadd] = false;

        if (isFarmer[_Firmadd]) {
            isFarmer[_Firmadd] = false;
        }
    }

    function getEntity() public view returns (Entity[] memory) {
        return entities;
    }

    function productCreation(
        string memory _variety,
        uint _price,
        uint _quantity,
        string memory _date
    ) public {
        require(isFarmer[msg.sender], "Address is not a registered farmer. Only a registered farmer can create this product");
        require(entityAllowed[msg.sender], "Entity is not allowed to create products");
        
        Product memory newProduct = Product({
            id: id, 
            variety: _variety,
            price: _price,
            quantity: _quantity,
            dateOfHarvest: _date,
            currentOwner: msg.sender, 
            creator: msg.sender
        });
        
        products.push(newProduct);
        id++; 
    }

    function getProducts() public view returns (Product[] memory) {
        return products;
    }

    receive() external payable {}

function updateProductPrice(uint _productId, uint _newPrice) public {
        Product storage product = products[_productId];
        require(msg.sender == product.currentOwner, "Only the current owner can update the price");
        require(_newPrice > 0, "Price must be greater than zero");

        product.price = _newPrice;
    }

    event ProductCreated(uint indexed productId, address indexed creator);

    function directPurchase(uint _productId, uint _weight, string memory _variety, uint _price, string memory _date) public payable {
        Product storage product = products[_productId];
        require(entityAllowed[msg.sender], "Entity is not allowed to purchase products.");
        require(product.quantity > 0, "Product out of stock.");
        require(_weight <= product.quantity, "Insufficient product quantity.");
        (bool success, ) = product.currentOwner.call{value: msg.value}("");
        require(success, "Ether transfer failed");
        Product memory newProduct = Product({
            id: id, 
            variety: _variety,
            price: _price,
            quantity: _weight,
            dateOfHarvest: _date,
            currentOwner: msg.sender, 
            creator: product.creator
        });
        
        products.push(newProduct); 
        emit ProductCreated(newProduct.id, msg.sender); 
        product.quantity -= _weight; 

        id++; 
    }

    struct Delivery {
        address logistics;
        uint quantity;
        address customer;
        uint fair;
        uint totalBill;
        uint productId;
    }

    mapping(address => Delivery) public deliveries;
    function delivery(uint _productId, address _logistics, uint _quantity, address _customer, uint _fair) public {
        require(entityAllowed[msg.sender], "Please register yourself");
        require(entityAllowed[_logistics], "Logistics not registered");
        require(entityAllowed[_customer], "Customer not registered");
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_productId < products.length, "Invalid product ID");
        
        Product storage product = products[_productId];
        require(product.quantity >= _quantity, "Insufficient product quantity");

        uint totalBill = product.price * _quantity + _fair;

        deliveries[_customer] = Delivery({
            logistics: _logistics,
            quantity: _quantity,
            customer: _customer,
            fair: _fair,
            totalBill: totalBill,
            productId: _productId
        });
        
    }
     function acceptDelivery() public payable {
        require(entityAllowed[msg.sender], "Please register yourself");
        Delivery storage currentDelivery = deliveries[msg.sender];
        require(currentDelivery.customer != address(0), "No pending delivery");
        require(msg.value >= currentDelivery.totalBill, "Insufficient payment");

    }
    function rejectDelivery() public {
        require(entityAllowed[msg.sender], "Please register yourself");
        Delivery storage currentDelivery = deliveries[msg.sender];
        require(currentDelivery.customer != address(0), "No pending delivery");

        delete deliveries[msg.sender]; 
    }

    function cancelDelivery() public {
        require(entityAllowed[msg.sender], "Please register yourself");
        Delivery storage currentDelivery = deliveries[msg.sender];
        require(currentDelivery.customer != address(0), "No pending delivery");

        payable(currentDelivery.logistics).transfer(currentDelivery.fair);
        uint remainingMoney = currentDelivery.totalBill - currentDelivery.fair;
        payable(msg.sender).transfer(remainingMoney);

        delete deliveries[msg.sender];
    }
    function receiveDelivery() public {
    require(entityAllowed[msg.sender], "Please register yourself");
    Delivery storage currentDelivery = deliveries[msg.sender];
    require(currentDelivery.customer != address(0), "No pending delivery");
    payable(currentDelivery.customer).transfer(currentDelivery.totalBill - currentDelivery.fair);
    payable(currentDelivery.logistics).transfer(currentDelivery.fair);
    Product storage product = products[currentDelivery.productId]; 
    require(product.quantity >= currentDelivery.quantity, "Not enough product quantity");
    product.quantity -= currentDelivery.quantity;
    Product memory newProduct = Product({
        id: id, 
        variety: product.variety, 
        price: product.price, 
        quantity: currentDelivery.quantity, 
        dateOfHarvest: product.dateOfHarvest, 
        currentOwner: msg.sender, 
        creator: product.creator 
    });
    products.push(newProduct);
    id++; 
    delete deliveries[msg.sender];
}
function getDeliveryDetails(address _customer) public view returns (
    address logistics,
    uint quantity,
    address customer,
    uint fair,
    uint totalBill,
    uint productId
) {
    require(entityAllowed[_customer], "Customer is not registered");
    Delivery memory currentDelivery = deliveries[_customer];
    require(currentDelivery.customer != address(0), "No delivery found for this customer");

    return (
        currentDelivery.logistics,
        currentDelivery.quantity,
        currentDelivery.customer,
        currentDelivery.fair,
        currentDelivery.totalBill,
        currentDelivery.productId
    );
}


}
                               
