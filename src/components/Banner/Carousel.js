import { makeStyles } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import { numberWithCommas } from "../CoinsTable";
import { StockData } from "../../config/api";

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const [stocks, setStocks] = useState([]);
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));

    console.log(data);
    setTrending(data);
    
    const result = await fetchStockData();
  };

  const fetchStockData = async () => {
    let stockList = ['MSFT','AAPL','IBM','TSLA'];
    let allData = [];
    for(var j = 0; j < stockList.length; j++){
      let stockName = stockList[j];
      console.log("stockName:", stockName);
      const API_KEY = 'HGJWFG4N8AQ66ICD';
      const { data } = await axios.get(StockData(stockName, API_KEY));
      let time_series_data = data['Time Series (Daily)'];
      // console.log(time_series_data);
      let keys = Object.keys(time_series_data);
      // console.log(keys);

      let values = time_series_data[keys[0]];
      // console.log(values);
      let keys2 = Object.keys(time_series_data[keys[0]]);
      // console.log(keys2);
      let high = values[keys2[1]];
      // console.log(high);


      let index2 = keys.length-5;
      let values2 = time_series_data[keys[index2]];
      // console.log(values2);
      let keys3 = Object.keys(time_series_data[keys[index2]]);
      // console.log(keys3);
      let high2 = values2[keys3[1]];
      // console.log(high2);


      let diff = high - high2;
      console.log("diff:", diff); 
      let percent_diff = diff/high2;
      let stockData = {
        "name": stockName,
        "high": high,
        "change": diff,
        "percent_change": percent_diff
      }
      // let stockData = [stockName, high2, diff, percent_diff];
      allData.push(stockData);
    }
    console.log(allData);
    setStocks(allData);
  };



  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const useStyles = makeStyles((theme) => ({
    carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center",
    },
    carouselItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "white",
    },
  }));

  const classes = useStyles();

  const items = stocks.map((coin) => {
    let profit = coin?.change >= 0;
    let img = new Image();
    img.addEventListener("load", ()=>{
      ctx.drawImage(img,0,0);
      ctx.font = '50px serif';
      ctx.fillText(coin.name, 50, 90);
    });
    coin.image = img;

    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <h1>
          {coin?.name}
        </h1>
        <span>
          {coin?.name}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"}
            {coin?.percent_change?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.change.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </div>
  );
};

export default Carousel;
