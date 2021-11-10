module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        clienteid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente"
        },
        servizi: String,
        partnerid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Partner"
        },
        segnalatoreid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Segnalatore"
        },
        tipo: String,
        dataInizio: Date,
        fatturato: Number       
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