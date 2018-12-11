import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Row, Col } from 'reactstrap';
import './style.css';
import web3 from '../web3';
const noWeb3ErrorMessage =
  'Could not connect to your web3 wallet. Please ensure your wallet is unlocked, and you are using the "Main Ethereum Network". ';
const noWeb3WalletFound = (
  <div>
    It looks like you do not have an ethereum wallet, or it is not enabled. In
    order to claim your token, please install{' '}
    <a href="http://metamask.io" target="_blank">
      Metamask
    </a>{' '}
    and refresh the page.
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animals: [],
      accounts: [],
      metamaskEnabled: false,
      errorMessage: false,
    };
  }

  componentWillMount() {
    this.enableWeb3();
  }

  enableWeb3 = () => {
    if (window.ethereum) {
      try {
        window.ethereum.enable().then(() => {
          window.web3.eth.getAccounts((err, accounts) => {
            console.log('metamask enabled!');
            this.setState({ metamaskEnabled: true, accounts }, () => {
              this.getTokenList();
            })
          });
        });
      } catch (e) {
        // console.log(e);
      }
    }
  };

  getTokenList() {
    let {
      accounts,
      metamaskEnabled
    } = this.state;

     try {
       if (!metamaskEnabled) {
         this.setState({ errorMessage: noWeb3WalletFound });
       } else {
         let account = accounts[0].toUpperCase();
        String.prototype.replaceAt=function(index, char) {
          var a = this.split("");
          a[index] = char;
          return a.join("");
        }
        account = account.replaceAt(1, "x");

         let requestURL = 'https://heritage-api.glitch.me/api/user?address=' + account;
         fetch(requestURL, {
            method: 'GET',
            headers:{
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials':true,
              'Access-Control-Allow-Methods':'POST, GET'
            }
          })
          .then(results => {
            debugger;
            // return results.json();
            // debugger;
            // var test2 = JSON.parse(results);
            // debugger;
            return results.json();
            // return JSON.stringify(results);
            // return JSON.parse(results);
          }).then(function(jsonData) {
            debugger;
            return JSON.stringify(jsonData);
          }).then(data => {
              debugger;
              this.setState({animals: data.tokenArray});
              // debugger;
          })
       }
     } catch (err) {
       this.setState({ errorMessage: noWeb3ErrorMessage });
     }
  }

  render() {
    return (
      <div className="container">
        <Row>
          {this.state.animals.map(function(animal, i) {
              var imgstring = "./dog" + animal.fundraiser_id + ".jpg";

              return <Col className="token-card" sm="3" key={ i }>
                  <Card>
                    <CardTitle>#{animal.TokenID}</CardTitle>
                    <CardImg top src={imgstring} alt="Card image cap" />
                    <CardBody>
                      <CardText>{animal.description}</CardText>
                    </CardBody>
                  </Card>
                </Col>
          })}
        </Row>
      </div>
    );
  }
}

export default App;
