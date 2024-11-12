// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract SupplyChain {
    enum EntityType { Farmer, Wholesaler, Logistics, Retailer, Customer }
    
    address public owner;
    uint public id;  // Make id public to easily check current value
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
        uint id; // Unique ID for each product
        string variety;
        uint price;
        uint quantity;
        string dateOfHarvest;
        address currentOwner; // Current owner of the product
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
        return entities; // Return all entities
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
            id: id, // Assign unique ID
            variety: _variety,
            price: _price,
            quantity: _quantity,
            dateOfHarvest: _date,
            currentOwner: msg.sender, // Initial creator is the current owner
            creator: msg.sender
        });
        
        products.push(newProduct);
        id++; // Increment ID after adding the new product
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

        // Ensure that the payment is made to the current owner
        (bool success, ) = product.currentOwner.call{value: msg.value}("");
        require(success, "Ether transfer failed");

        // Create new product to represent the purchase
        Product memory newProduct = Product({
            id: id, // Assign a unique ID
            variety: _variety,
            price: _price,
            quantity: _weight,
            dateOfHarvest: _date,
            currentOwner: msg.sender, // New owner is the buyer
            creator: product.creator
        });
        
        products.push(newProduct); // Add the new product to the array
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

        delete deliveries[msg.sender]; // Clear the delivery record on rejection
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

    // Transfer payment to the customer and logistics
    payable(currentDelivery.customer).transfer(currentDelivery.totalBill - currentDelivery.fair);
    payable(currentDelivery.logistics).transfer(currentDelivery.fair);
    
    // Access the product being delivered
    Product storage product = products[currentDelivery.productId]; 
    require(product.quantity >= currentDelivery.quantity, "Not enough product quantity");

    // Update the existing product's quantity
    product.quantity -= currentDelivery.quantity;

    // Create a new product record for the received delivery
    Product memory newProduct = Product({
        id: id, // Assign a unique ID
        variety: product.variety, // Access variety from the existing product
        price: product.price, // Access price from the existing product
        quantity: currentDelivery.quantity, // Use the quantity from the delivery
        dateOfHarvest: product.dateOfHarvest, // Access date of harvest from the existing product
        currentOwner: msg.sender, // New owner is the receiver
        creator: product.creator // Original creator
    });

    // Add the new product to the products array
    products.push(newProduct);
    id++; // Increment ID for the next new product

    // Clear the delivery record
    delete deliveries[msg.sender];
}


}
                               