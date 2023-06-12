import { LinearProgress, makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import {  } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";
import { StockData } from "../config/api";

const API_KEY = 'HGJWFG4N8AQ66ICD';


const StockPage = () => {
  const { id } = useParams();
  console.log("id:", id);
  const [stock, setStock] = useState();

  const { currency, symbol } = CryptoState();

  const fetchStock = async () => {
    console.log("id:", id);
    const { data } = await axios.get(StockData(id, API_KEY));
    console.log("data:");
    console.log(data);
    var dataSet = data['Time Series (Daily)'];
    console.log("dataSet:", dataSet);
    console.log("dataSet.length:", dataSet.length);
    for (var key in dataSet){
      var value = dataSet[key];
      var d = value.high;
      console.log("d:", d);
      newData.push(d);
    }
    var newData = [];
    for(var j = 0; j < dataSet.length; j++){
      var d = dataSet[j].high;
      console.log("d:", d);
      newData.push(d);
    }
    setStock(data);
  };

  useEffect(() => {
    fetchStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
  }));

  const classes = useStyles();

  if (!stock) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <Typography variant="h3" className={classes.heading}>
          {stock?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {ReactHtmlParser(stock?.name)}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {(stock?.price)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {(
                stock?.price
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {(
                stock?.price
              )}
              M
            </Typography>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
