import React, { Component } from 'react';

import './Game.css';

class Game extends Component{

    constructor (props){
        super(props);
        const {limitCards = 25} = props;
        this.cards = React.createRef();

        this.limitCards = typeof limitCards === 'number' ? limitCards : 25;

        this.state = {
            userInput:'',
            items: [],
            checkedBlue: false,
            checkedYellow: false,
            checkedRed: false,
            indexBlue:'',
            blueArr: [],
            indexYellow:'',
            yellArr: [],
            indexRed:'',
            redArr: []
        };
    }


    handleClickBlue(i){
        this.setState({
            checkedBlue: !this.state.checkedBlue,
            indexBlue: i,
            blueArr: [...this.state.blueArr, this.state.indexBlue]
        })
    }
    
    handleClickYellow(i){
        this.setState(prevState=>({
            checkedYellow: !prevState.checkedYellow,
            indexYellow: i,
            yellArr: [...this.state.yellArr, this.state.indexYellow]
        }))        
    }
    handleClickRed(i){
        this.setState(prevState=>({
            checkedRed: !prevState.checkedRed,
            indexRed: i,
            redArr: [...this.state.redArr, this.state.indexRed]
        }))        
    }

    onChange(event){
        this.setState({
            userInput : event.target.value
        });
    }

    addTodo(event){
        event.preventDefault();
        this.setState({
            userInput:  '',
            items: [...this.state.items, this.state.userInput]
        });
        console.log(this.state.items)
    }

    deleteTodo(event){
        //event.preventDefault();
        let array = this.state.items;
        let index = array.indexOf(event);
        array.splice(index, 1);
        this.setState({
            items: array
        });
        console.log(array)
    }
    clearAll = () => {
        this.setState({
            items: []
        })
    }
    

    renderTodos(){
        
        return this.state.items.map((item)=> {
            let blueArr = this.state.blueArr;
            let yelArr = this.state.yellArr;
            let redArr = this.state.redArr;

            return (
                
                <div
                    className= {`col-2dot4
                        ${blueArr.includes(item.toString()) && this.state.checkedBlue === true ? 'col-2dot4-Blue' : '' } 
                        ${yelArr.includes(item.toString()) && this.state.checkedYellow === true ? 'col-2dot4-Yellow' : 'col-2dot4'}
                        ${redArr.includes(item.toString()) && this.state.checkedRed === true? 'col-2dot4-Red' : 'col-2dot4'}
                    `}
                    key={item.toString()} 
                    id={item.toString()}
                    value={item.toString()}
                >

                    {item} | <button className="btn btn-primary" onClick={this.deleteTodo.bind(this)}>X</button>
                    {console.log(item.id)}
                    {/* <Select 
                        options={options}
                        onChange={this.handleChange} 
                        id={item.toString()}
                    /> */}
                    {/* <select className="custom-select" id={item.toString()}>
                        <option selected>Couleurs</option>
                        <option value="1">Bleu</option>
                        <option value="2">Jaune</option>
                        <option value="3">Rouge</option>
                    </select> */}
                    {/* CHANGE CARD COLOR  */}
                    <div className="colorChoice">
                        {/* TURN BLUE */}
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id={item.toString()+'Blue'}
                            onClick={this.handleClickBlue.bind(this, item.toString())} defaultChecked={this.state.checkedBlue}/>
                            <label className="custom-control-label" htmlFor={item.toString()+'Blue'}>Bleu</label>
                        </div>
                        &nbsp;
                        {/* {/* TURN YELLOW  */}
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id={item.toString()+'Yellow'}
                            onClick={this.handleClickYellow.bind(this, item.toString())} defaultChecked={this.state.checkedYellow}/>
                            <label className="custom-control-label" htmlFor={item.toString()+'Yellow'}>Jaune</label>
                        </div>
                        &nbsp;
                        {/* {/* TURN RED  */}
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id={item.toString()+'Red'}
                            onClick={this.handleClickRed.bind(this, item.toString())} defaultChecked={this.state.checkedRed}/>
                            <label className="custom-control-label" htmlFor={item.toString()+'Red'}>Rouge</label>
                        </div>

                        </div>
                </div>
            );
            
        });
    }


    render() {
        
        return (
            <div>
                <h1 align="center">LE JEU</h1>
                <form className="form">
                    <input
                        value={this.state.userInput} 
                        type="text" 
                        placeholder="Nouveau Mot"
                        onChange={this.onChange.bind(this)}
                    />
                    &nbsp;
                    <button className="btn btn-primary" onClick={this.addTodo.bind(this)}>Ajouter</button>
                </form>
                <div align="center">
                    <button align="center" className="btn btn-primary" onClick={this.clearAll}>Nouvelle Partie</button>
                </div>
                <div className="row" ref={this.cards}>
                    {this.renderTodos()}
                </div>
                
            </div>
        );
    }
}

export default Game;