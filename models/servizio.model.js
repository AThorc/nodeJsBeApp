module.exports = mongoose => {
    var schema = mongoose.Schema(
      {    
        servizi: String,       
        dataInizio: Date,
        fatturato: Number,
        userid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,    
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Servizio = mongoose.model("servizio", schema);
    return Servizio;
  };