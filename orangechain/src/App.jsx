/* eslint-disable */
import React, { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import ProxyAbi from "./contracts/SupplyChain.json";
import Home from "./components/Home/Home";
import NavbarMain from "./components/HomeNavbar/NavbarMain";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import "./App.css";
import CreateProduct from "./components/CreateProduct/CreateProduct";
import Products from "./components/GetProducts/Products";
import Entities from "./components/GetEntities/Entities";
import DirectPurchase from "./components/DirectPurchase/DirectPurchase";
import Order from "./components/Order/Order";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import OrderStatus from "./components/OrderStatus/OrderStatus";
import Delivery from "./components/Delevery/Delivery";
import ProfileData from "./components/HomeNavbar/ProfileData";
import ProductMain from "./components/GetProducts/ProductMain";

function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [proxyAddress, setContractAddress] = useState(null);
  const [address, setAddress] = useState("No account connected yet");

  useEffect(() => {
    async function getAccount() {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          console.log("No accounts found");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    }
    getAccount();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ProxyAbi.networks[networkId];

        setContractAddress(deployedNetwork.address);
        const instance = new web3.eth.Contract(
          ProxyAbi.abi,
          deployedNetwork && deployedNetwork.address
        );
        setState({ web3, contract: instance });
      } catch (error) {
        alert("Please connect with wallet first");
        console.log(error);
      }
    };
    init();
  }, []);

  return (
    <>
      <BrowserRouter>
        <NavbarMain />
        <Routes>
          <Route path="/" element={<Home state={state} />} />
          <Route path="/registermember" element={<CreateAccount state={state} />} />
          <Route path="/createproduct" element={<CreateProduct state={state} />} />
          <Route path="/product" element={<ProductMain state={state} />} />
          <Route path="/members" element={<Entities state={state} />} />
          <Route path="/OrderStatus" element={<OrderStatus state={state} />} />
          <Route path="/aboutthe platform" element={<About state={state} />} />
          <Route path="/profile data" element={<ProfileData state={state} />} />
          <Route path="/Order/:id/:price" element={<Order state={state} />}/>
          <Route path="/Delivery/:id/:price" element={<Delivery state={state} />}/>
          <Route path="/product-details/:id/:variety/:price/:quantity/:dateOfHarvest/:creator/:currentOwner/:imageHash/:prediction/:confidence" element={<Products  state={state}   />}  />

          <Route path="/DirectPurchase/:id/:price/:variety/:dateOfHarvest/:creator"element={<DirectPurchase state={state} />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}
export default App;
