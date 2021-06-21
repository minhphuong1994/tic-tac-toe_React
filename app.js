class Square extends React.Component { 
  render() {    
    return (
      <button className={this.props.name}
      onClick={() =>this.props.onClick()}>
        {this.props.value}
      </button>
    )
  }
}

class Board extends React.Component { 
  renderSquare(i) {
    let check = this.props.numbers.slice()   
    // console.log(check)
    const name2 = "button is-danger is-outlined"
    const name1 = "button is-success is-outlined"
    for(let j = 0;j<check.length;j++){
      if(check[j] == i)
        return (<Square     
          name ={name2}
          value={this.props.arr[i]} 
          onClick={()=> this.props.onClick(i)}/>)  
    }
    return (<Square     
      name ={name1}
      value={this.props.arr[i]} 
      onClick={()=> this.props.onClick(i)}/>)
  }

  render() {       
    return (
      <div>        
        <div>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

const checkWinner = (arr)=>{
  let winner = ""
  let result = Array(3).fill(null)
  // console.log(result)
  const checkers = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,4,8], [2,4,6], [0,3,6],
    [1,4,7], [2,5,8]
  ]
  
  for(let i = 0; i<checkers.length;i++){
    let countX = 0
    let countO =0
    for(let j = 0; j<checkers[i].length;j++){     
      const marker = arr[checkers[i][j]]     
      if(marker == 'X' || marker== 'O'){
        if(marker == 'X')
          countX +=1
        else
          countO +=1
      }
    }
    // console.log("CountX:"+countX+" CountO:"+countO)
    if(countO == 3 || countX ==3){
      if(countX == 3)
        winner = 'X'          
      if(countO == 3)
        winner = 'O'
      for(let y = 0; y<checkers[i].length;y++){
        result[y] = checkers[i][y]        
      }
    }    
  }
  result.push(winner) //add winner then return set of result
  // console.log(result)
  return result
}

const Noti = ()=>{  
    return (
      <p>Note: when reviewing, you must back to the lastest step to continue the game.</p>
    )  
}


class Game extends React.Component {
  constructor(props){
    super(props)
    this.state ={
      records: [{arr: Array(9).fill(null)}],
      moveNumber: 0,
      nextPlayer: 'X',
      winner: ''      
    }
  }
  
  handleClick(i){
    const records = this.state.records
    const current = records[records.length -1]
    const squares = current.arr.slice()
    const win = this.state.winner
    if(squares[i]==null && win=='' && this.state.moveNumber==(records.length-1)){
      if(this.state.nextPlayer === 'X'){
        squares[i] = 'X' 
        this.setState({nextPlayer:'O'})}     
      else{
        squares[i] = 'O'
        this.setState({nextPlayer:'X'})} 
        
      const result = checkWinner(squares)        
      this.setState({records: records.concat([{arr: squares}]),winner: (result[result.length-1]), moveNumber:(records.length)})
      // console.log('WinnerX: '+result[result.length-1])
    }    
    // console.log('Winner: '+this.state.winner)
  }
  
  moveTo(i){
    const records = this.state.records    
    const squares = records[i].arr.slice()
    const win = this.state.winner
    const result = checkWinner(squares)
    this.setState({moveNumber:i, winner: (result[result.length-1]), nextPlayer: (i%2)===0?'X':'O', moveNumber:i})
  }

  render() {
    const records = this.state.records
    const current = records[this.state.moveNumber]
    const check = checkWinner(current.arr)
    const winner = check[check.length-1] 
    let status;
    if (winner != '') {
      status = 'Winner: ' + winner
    } else {
      status = 'Next Player: ' + this.state.nextPlayer
    }
    // console.log(check.slice(0,-1))
    const history = records.map((record,index) =>{ //mapping each record and its index in 2D records arr
      let label = null
      if(index == 0){
        label = "Restart Game"
        return(
          <li key={index} className="columns is-centered"> 
          <button onClick={()=>location.reload(false)}>{label}</button>
          </li>
        )
      }        
      else{
        label = "Review step number "+ index    
        return( //putting key this way only help to turn off the warning         
          <li key={index} className="columns is-centered"> 
            <button onClick={()=>this.moveTo(index)}>{label}</button>
          </li>
        )
      }
        
    })


    return (
      <div className="container is-fluid">
        <div className="has-text-centered">
          <Board arr={current.arr} numbers={check.slice(0,-1)}
                onClick={(i)=>this.handleClick(i)} />
        </div>
        <div className="notification">
          <div className="columns is-centered">{status}</div>
          <div className="columns is-centered">{<Noti/>}</div>
          <ul>{history}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);