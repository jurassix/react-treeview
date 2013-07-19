/**
* @jsx React.DOM
*/

var TreeView = React.createClass({
  render: function() {
    var self = this;
    // parse the data. format:
    // [
    //   {displayNode: bla, children: [bla, bla]},
    //   {displayNode: bla, children: [bla, bla]},
    // ]
    var wholeTree = this.props.source.map(function(item) {
      return self._formatSource(item);
    });
    var className = this.props.className;
    return (
      <ul className={'treeview' + (className ? ' ' + className : '')}>
        {wholeTree}
      </ul>
    );
  },
  _formatSource: function(child) {
    // recursively construct the markup by digging into child nodes
    var self = this;
    // simple uid for the child to let React diff correctly during `render`
    if (!child.displayNode.props.key) {
      child.displayNode.props.key = Math.random();
    }
    return (
      // `initiallyCollapsed` works only at the beginning, If `canToggle` is set
      // to true, the tree node will naturally manage its expanded/collapsed
      // state itself afterward
      <TreeNode
        key={child.displayNode.props.key}
        displayNode={child.displayNode}
        initiallyCollapsed={child.initiallyCollapsed}
        canToggle={child.canToggle == null ? true : child.canToggle}>
        {
          (child.children && child.children.length)
            ? child.children.map(function(subChild) {
                return self._formatSource(subChild);
              })
            : null
        }
      </TreeNode>
    );
  },
});

var TreeNode = React.createClass({
  getDefaultProps: function() {
    return {canToggle: true};
  },
  getInitialState: function() {
    return {collapsed: this.props.initiallyCollapsed};
  },
  render: function() {
    var arrow = (
      <div className="treenode-arrow">
        {this.props.children && this.props.children.length
          ? this.state.collapsed ? '▸' : '▾'
          : null}
      </div>
    );
    return (
      <li className="treenode">
        <div onClick={this.toggle}>
          {arrow}
          <div className="treenode-item">{this.props.displayNode}</div>
        </div>
        <ul className={this.state.collapsed ? "treenode-collapsed" : ""}>
          {this.props.children}
        </ul>
      </li>
    );
  },
  toggle: function() {
    if (this.props.canToggle) {
      this.setState({collapsed: !this.state.collapsed});
    }
  }
});