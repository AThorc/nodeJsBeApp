module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        codiceFiscale: String,
        partitaIVA: String,
        legaleRappresentate: String,
        telefono: String,
        cellulare: String,
        mail: String,
        pec: String,
        sede: String,
        localita: String,
        cap: String,
        //Unica entità
        ragioneSociale: String,      
        dataCostituzione: Date,
        inizioAttivita: Date,
        tipo: String,
        dimensione: String,
        attIstatAteco2007: String,
        settore: String,
        partners: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partner"
          }
        ],
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Cliente = mongoose.model("cliente", schema);
    return Cliente;
  };