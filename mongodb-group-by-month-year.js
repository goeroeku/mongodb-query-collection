db.getCollection("orders").aggregate([
  {
    $match: {
      status: "success",
      createdAt: {
        $gte: ISODate("2010-04-29"),
        $lt: ISODate("2020-05-01")
      }
    }
  },
  {
    $group: {
      _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
      total: { $sum: "$total" }
    }
  },
  { $sort: { _id: 1 } },
  {
    $addFields: {
      periode: {
        $concat: [
          {
            $let: {
              vars: {
                monthsInString: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec"
                ]
              },
              in: {
                $arrayElemAt: [
                  "$$monthsInString",
                  { $subtract: ["$_id.month", 1] }
                ]
              }
            }
          },
          " ",
          { $toString: "$_id.year" }
        ]
      }
    }
  }
]);
