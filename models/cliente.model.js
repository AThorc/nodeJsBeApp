module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        ragioneSocialeid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RagioneSociale"
        },
        codiceFiscale: String,
        partitaIVA: String,
        legaleRappresentate: String,
        telefono: String,
        cellulare: String,
        mail: String,
        pec: String,
        sede: String,
        localita: String,
        cap: String
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