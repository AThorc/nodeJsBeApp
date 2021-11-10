module.exports = mongoose => {
    var schema = mongoose.Schema(
      { 
        denominazione: String,      
        dataCostituzione: Date,
        inizioAttivita: Date,
        tipo: String,
        dimensione: String,
        attIstatAteco2007: String,
        settore: String,       
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const RagioneSociale = mongoose.model("RagioneSociale", schema);
    return RagioneSociale;
  };