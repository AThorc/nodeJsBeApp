module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        servizioid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Servizio"
        },
        clientes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente"
          }
        ],
        denominazione: String,
        dataInizio: Date,        
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Partner = mongoose.model("partner", schema);
    return Partner;
  };