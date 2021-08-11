// const checkPromise = () =>
//   new Promise((resolve, reject) => {
//     habbits.forEach(async (habbit) => {
//       console.log("Habb: ", habbit);
//       const userHabbit = await userHabbitService.find({
//         user: { $eq: req.body.user },
//         habbit: { $eq: habbit._id },
//         date: { $eq: challange[0].date },
//       });
//       flag++;
//       console.log("state", flag);
//       resolve(flag);
//     });
//   });

// module.exports.checkPromise = checkPromise;
