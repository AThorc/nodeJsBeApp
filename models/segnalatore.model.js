module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        servizioid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Servizio"
        },
        denominazione: String,
        dataInizio: Date,
        fatturatoSegnalatore: Number,
        clientes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente"
          }
        ]    
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Segnalatore = mongoose.model("segnalatore", schema);
    return Segnalatore;
  };