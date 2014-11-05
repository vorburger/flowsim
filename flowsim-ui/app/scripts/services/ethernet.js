'use strict';

angular.module('flowsimUiApp')
  .factory('ETHERNET', function ETHERNET(fgConstraints, fgUI, Utils) {

var NAME = 'Ethernet';

//var Bytes = 14;

var Payloads = {
  'VLAN': 0x8100,
  'MPLS': 0x8847,
  'ARP':  0x0806,
  'IPv4': 0x0800,
  'IPv6': 0x86dd,
  'Payload' : 0x0000
};

function Ethernet(eth, src, dst, typelen) {
  if(eth instanceof Ethernet) {
    this.name    = eth.name;
    this.src     = new Ethernet.MAC(eth.src);
    this.dst     = new Ethernet.MAC(eth.dst);
    this.typelen = new Utils.UInt(eth.typelen);
  } else if(eth instanceof Ethernet_UI) {
    this.name    = eth.name;
    this.src     = new Ethernet.MAC(eth.attrs[0].value);
    this.dst     = new Ethernet.MAC(eth.attrs[1].value);
    this.typelen = new Utils.UInt(eth.attrs[2].value, 16);
  } else if(typeof eth === 'string') {
    this.name    = eth;
    this.src     = new Ethernet.MAC(src);
    this.dst     = new Ethernet.MAC(dst);
    this.typelen = new Utils.UInt(typelen, 16);
  }
}

Ethernet.Name = NAME;

Ethernet.TIPS = {
  src: 'Ethernet source address',
  dst: 'Ethernet destination address',
  typelen: 'Ethernet payload type or length'
};

Ethernet.MAC = function(mac) {
  var tmp;
  if(typeof mac === 'string') {
    tmp = mac.match(Ethernet.MAC.Pattern);
    if(!tmp || tmp.length < 12) {
      throw 'Bad MAC Address: ' + mac;
    } 
    this.value = _.map(_.range(6), function(i) {
      return parseInt('0x'+tmp[2*i+1]);
    });
  } else if(mac instanceof Ethernet.MAC) {
    this.value = _.clone(mac);
  } else if(mac === undefined) {
    this.value = [0, 0, 0, 0, 0, 0];
  } else {
    throw 'Bad MAC Address: ' + mac;
  } 
};

Ethernet.MAC.prototype.equal = function(mac) {
  var i;
  for(i=0; i<6; ++i) {
    if(this.value[i] !== mac.value[i]) {
      return false;
    }
  }
  return true;
};

Ethernet.MAC.Broadcast = new Ethernet.MAC('ff:ff:ff:ff:ff:ff');

Ethernet.MAC.Pattern = /^([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})$/;

Ethernet.MAC.is = function(addr) {
  return Ethernet.MAC.Pattern.test(addr);
};

Ethernet.MAC.Broadcast.is = function(addr) {
  return this.equal(addr);
};

Ethernet.MAC.isMulticast = function(addr) {
  return addr.value[0] & 0x01;
};

Ethernet.MAC.prototype.toString = function() {
  return _.map(this.value, function(oct) { 
    return Utils.padZeros(oct.toString(16), 2);
  }).join(':');
};

Ethernet.MAC.Match = function(addr, mask) {
  this.addr = new Ethernet.MAC(addr);
  this.mask = new Ethernet.MAC(mask);
};

Ethernet.MAC.Match.prototype.match = function(addr) {
  var i;
  for(i=0; i<6; ++i) {
    if(this.addr.value[i] !== (this.mask.value[i] & addr.value[i])) {
      return false;
    } 
  } 
  return true;
};

Ethernet.MAC.Match.prototype.toString = function() {
  return this.addr.toString() + '/' + this.mask.toString();
};

Ethernet.TESTS = {
  src: Ethernet.MAC.is,
  dst: Ethernet.MAC.is,
  typelen: Utils.UInt.is(16)
};

function Ethernet_UI(eth) {
  eth = eth === undefined ? new Ethernet() : eth;
  this.name = NAME;
  this.bytes = eth.bytes;
  this.attrs = _.map(eth.fields, function(value, key) {
    switch(key) {
      case 'src':
        return {
          name: key,
          value: value,
          test: Ethernet.MAC.is,
          tip: 'Ethernet source MAC address'
        };
      case 'dst':
        return {
          name: key,
          value: value,
          test: Ethernet.MAC.is,
          tip: 'Ethernet destination MAC address'
        };
      case 'typelen':
        return {
          name: key,
          value: value.toString(16),
          test: fgConstraints.isUInt(0, 0xffff),
          tip: 'Ethernet type/length of payload'
        };
      default:
        return {
          name: key,
          value: value,
          test: function() { return true; },
          tip: 'Unknown'
        };
    }
  });
}

Ethernet_UI.prototype.toBase = function() {
  return new Ethernet(this);
};

Ethernet_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = '0x' + (Payloads[name] || 0).toString(16);
};

Ethernet_UI.prototype.clearPayload = function() {
  this.attrs[2].value = '0x0000';
};

return {
  name:        NAME,
  Ethernet:    Ethernet,
  Ethernet_UI: Ethernet_UI,
  create:      function()            { return new Ethernet(); },
  createUI:    function(eth)         { return new Ethernet_UI(eth); },
  Payloads:    Object.keys(Payloads)
};

});
