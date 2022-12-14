import Employee from "../models/Employee.js";
import User from "../models/User.js";

export const createEmployee = async (req, res, next) => {

  const userId = req.params.userId;
  const id = req.params.id

  const userData = await User.findById(id)
  
  const newEmployee = new Employee({
    empId:userId,
    empFname:userData.userFname,
    empMname:req.body.empMname,
    empLname:userData.empLname ? userData.empLname : req.body.empLname,
    email:userData.email ? userData.email : req.bod.email,
    mobile:userData.mobile ? userData.mobile : req.body.mobile,
    pan:req.body.pan,
    createDate:req.body.createDate
  });

  try {
    const savedEmployee = await newEmployee.save();
    await User.updateOne({empId:savedEmployee.empId},{mobile:savedEmployee.mobile})
    await User.updateOne({empId:savedEmployee.empId},{email:savedEmployee.email})
    res.status(200).json(savedEmployee);
  } catch (err) {
    next(err);
  }
};

// export const countByuserName = async (req, res, next) => {
    
//   try {
//     const names = await Employee.find();
//     const fname = names.empFname
//     res.status(200).json();
//   } catch (err) {
//     next(err);
//   }
// };



export const updateEmployee = async (req, res, next) => {
  
 const idData = await Employee.findOne({empId:req.params.id})
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      idData._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedEmployee);
  } catch (err) {
    next(err);
  }
};


export const deleteEmployee = async (req, res, next) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json("Employee has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getEmployee = async (req, res, next) => {
 const idData = await Employee.findOne({empId:req.params.id})

  try {
    const employee = await Employee.findById(idData._id);
    res.status(200).json(employee);
  } catch (err) {
    next(err);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employee = await Employee.find();
    res.status(200).json(employee);
  } catch (err) {
    next(err);
  }
};
