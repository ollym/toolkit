
module.exports = [
  
  function GCD(result) {
    
    result((12).gcd(6, 9), 3, 'Normal');
  },
  
  function LCM(result) {
    
    result((21).lcm(6), 42, 'Normal');
  },
  
  function Round(result) {

    result((1.5).round(), 2, 'API Preservation');
    result((1).round(1).toString(), '1.0', 'Normal');
    result((15).round(-1), '20', 'Normal');
  }

];