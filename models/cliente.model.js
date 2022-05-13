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
        userid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        naturaGiuridica: String,
        socio1: String,
        socio2: String,
        socio3: String,
        socio4: String,
        socio5: String,
        socio6: String,
        segnalatore: String,
        percentualeSocio1: Number,
        percentualeSocio2: Number,
        percentualeSocio3: Number,
        percentualeSocio4: Number,
        percentualeSocio5: Number,
        percentualeSocio6: Number
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