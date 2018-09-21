import React, { Component } from 'react';
import './App.css';
import { applyPredicatesOnText, trimText } from "./Util.js";
import { FILTERS } from './Filters.js'

const TEXT_BOX_ID = "textBoxKey";

/**
 * CheckBox. When it is checked, it calls this.props.onUpdatePredicateList to transmit 
 * the id of the checkbox plus its associated pattern
 */
class FilterCheckBox extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onUpdatePredicateList({
      id: this.props.value,
      pattern: this.props.pattern,
      color: this.props.color,
    });
  }

  render() {
    const inputProps = {
      onChange: this.handleChange,
      id: this.props.value,
      value: this.props.value,
      checked: this.props.checked,
    };

    return (
      <div className="FilterCheckBoxContainer">
        <input type="checkbox" {...inputProps} />
        <label htmlFor={this.props.value}>
          <font color={this.props.color}>{this.props.value}</font>
        </label>
      </div>
    );
  }
}

class TextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const text = event.target.value;
    this.props.onUpdatePredicateList({
      id: TEXT_BOX_ID,
      pattern: text,
      color: "#5e0b17",
    });
    this.setState({value: text});
  }

  render() {
    return (
      <input type="text" name={TEXT_BOX_ID}
        value={this.state.value} onChange={this.handleChange} />
    );
  }
}

/**
 * Container that stores the analyzed result 
 */
class ResultArea extends Component {
  render() {
    return (
      <div className="Result-area" dangerouslySetInnerHTML={{ __html: this.props.value }} />
    );
  }
}

class InputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      disabled: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const currentText = event.target.value;
    this.setState({ text: currentText });
  }

  clear() {
    this.setState({ text: '' });
  }

  triggerAnalysis() {
    this.props.onUpdate(this.state.text);
    this.setState({ disabled: true });
  }

  toggleRemoveFilter() {
    this.props.onUpdatePredicateList(null);
  }

  render() {
    const filterCheckBoxes = FILTERS.map(f => {
      const inputProps = {
        onUpdatePredicateList: this.props.onUpdatePredicateList,
        key: f.value,
        value: f.value,
        pattern: f.pattern,
        color: f.color,
        checked: this.props.selectedItems.has(f.value),
      };

      return <FilterCheckBox {...inputProps} />
    });

    return (
      <div>
        <textarea
          className="textBox"
          placeholder="copy/paste here the log to analyze"
          value={this.state.text}
          onChange={this.handleChange}
          disabled={this.state.disabled}
        />

        <div>
          <button className="Button" onClick={() => this.toggleRemoveFilter()}>Remove filters</button>
          <button className="Button" onClick={() => this.triggerAnalysis()}>Analyze</button>
          <button className="Button" onClick={() => this.clear()}>Clear</button>
          <TextBox onUpdatePredicateList={this.props.onUpdatePredicateList}/>
          {filterCheckBoxes}
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      predicates: new Array(0),
    };
    this.update = this.update.bind(this);
    this.updatePredicateList = this.updatePredicateList.bind(this);
  }

  update(val) {
    const trimmed = trimText(val);
    this.setState({ value: trimmed });
  }

  /**
   * Updates the list of filters by appending the given predicate to the existing list. 
   * If null is passed as argument, it means 'no filter'.
   * 
   * @param {*} item 
   */
  updatePredicateList(item) {
    let predicates = [];
    if (item !== null) {
      var found = false;
      predicates = this.state.predicates.slice();
      for (var i = 0; i < predicates.length; i++) {
        if (predicates[i].id === item.id) {
          // Remove it, a checkbox has been unchecked.
          found = true;
          predicates.splice(i, 1);
          break;
        }
      }

      const isTextInputPredicate = item.id === TEXT_BOX_ID;
      if (!found || isTextInputPredicate) {
        // Add it to the list if not found (it means a checkbox has been checked)
        // or the text in input text box has changed, in that case, the predicate 
        // must be updated. 
        let addItem = true;
        if (isTextInputPredicate) {
          addItem = item.pattern && item.pattern !== "";
        }

        if(addItem) {
          predicates.push(item);
        }
      }
    }
    this.setState({ predicates: predicates });
  }

  render() {
    let predicates = this.state.predicates;
    let textPredicate;
    const idx = predicates.findIndex(p => p.id === TEXT_BOX_ID);
    if(idx > -1) {
      textPredicate = [predicates[idx]];
      predicates.splice(idx, 1); // remove the predicate from this array
    }
    const result = applyPredicatesOnText(this.state.value, predicates, textPredicate);

    const selectedItems = new Set();
    this.state.predicates.map(p => selectedItems.add(p.id));

    return (
      <div className="App">
        <InputArea
          onUpdate={this.update}
          onUpdatePredicateList={this.updatePredicateList}
          selectedItems={selectedItems} />
        <ResultArea value={result} />
      </div>
    );
  }
}

export default App;