return objetivoAberto ? (
                          <>
                            <Pressable // OBJETIVO ROW
                              key={obj.id}
                              style={(state: any) => [
                                state.hovered && { backgroundColor: "#F1F5F9" },
                                styles.objetivoRow,
                                {
                                  flexDirection: "column",
                                  transitionProperty: "background-color",
                                  transitionDuration: "200ms",
                                  transitionTimingFunction: "ease-in-out",
                                  gap: 20,
                                },
                                objetivoEstaSendoEditado && {
                                  cursor: "default",
                                  flexDirection: "column",
                                  borderColor: "rgba(61, 132, 246, 0.41)",
                                  borderStyle: "dashed",
                                  borderWidth: 2,
                                },
                              ]}
                              onPress={() => {
                                // BOTAO CONCLUIR OBJETIVO
                                if (!objetivoEstaSendoEditado)
                                  toggleObjetivo(etapa.id, obj.id);
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: "row",
                                  width: "100%",
                                }}
                              >
                                {/* OBJETIVO */}
                                {objetivoEstaSendoEditado ? (
                                  // FIX ME: EDITANDO OBJETIVO
                                  <View
                                    style={{
                                      flex: 1,
                                      gap: 20,
                                      paddingHorizontal: 12,
                                      paddingTop: 12,
                                    }}
                                  >
                                    <View style={{ gap: 4 }}>
                                      <Text style={styles.objetivoEditLabel}>
                                        Título:
                                      </Text>
                                      <TextInput
                                        style={[
                                          globalStyles.input,
                                          {
                                            flex: 1,
                                            backgroundColor: "white",
                                            color: "black",
                                          },
                                        ]}
                                        value={objetivoTituloEditInput}
                                      />
                                    </View>

                                    <View style={{ gap: 4 }}>
                                      <Text style={styles.objetivoEditLabel}>
                                        Descrição (opcional):
                                      </Text>
                                      <TextInput
                                        style={[
                                          globalStyles.input,
                                          {
                                            flex: 1,
                                            backgroundColor: "white",
                                            color: "black",
                                          },
                                        ]}
                                        value={objetivoDescricaoEditInput}
                                      />
                                    </View>
                                  </View>
                                ) : (
                                  <View
                                    style={{
                                      flex: 1,
                                      flexDirection: "row",
                                      gap: 8,
                                    }}
                                  >
                                    <View style={styles.check}>
                                      {obj.concluido && (
                                        <Check
                                          color={colors.lightBlue}
                                          style={{ backgroundColor: "white" }}
                                        />
                                      )}
                                    </View>
                                    <View style={{ gap: 4 }}>
                                      <Text style={styles.objetivoTituloText}>
                                        {obj.titulo}
                                      </Text>
                                      <Text
                                        style={styles.objetivoDescricaoText}
                                      >
                                        {obj.descricao}
                                      </Text>
                                    </View>
                                  </View>
                                )}
                              </View>

                              {/* ROW BOTAO EDITAR/SALVAR EXCLUIR/CANCELAR */}
                              <View
                                style={{
                                  flexDirection: "row",
                                  gap: 8,
                                  marginLeft: 8,
                                  justifyContent: "flex-end",
                                  marginRight: 8,
                                  alignSelf: "flex-end",
                                }}
                              >
                                {/* BOTAO EDITAR/SALVAR OBJETIVO */}
                                <Pressable
                                  style={(state: any) => [
                                    globalStyles.secondaryButton,
                                    {
                                      paddingVertical: 8,
                                      width: 40,
                                      height: 32,
                                      backgroundColor: state.hovered
                                        ? idObjetivoSendoEditado == obj.id
                                          ? colors.green
                                          : colors.lightBlue
                                        : "#fff",
                                      transitionProperty: "background-color",
                                      transitionDuration: "200ms",
                                      transitionTimingFunction: "ease-in-out",
                                    },
                                  ]}
                                  onPress={() => {
                                    if (!objetivoEstaSendoEditado) {
                                      setIdObjetivoSendoEditado(obj.id);
                                      setObjetivoTituloEditInput(obj.titulo);
                                      setObjetivoDescricaoEditInput(
                                        obj.descricao,
                                      );
                                    } else {
                                      // FIX ME: ADCIONAR FUNCAO DE EDITAR OBJETIVO
                                      setIdObjetivoSendoEditado(0);
                                    }
                                  }}
                                >
                                  {idObjetivoSendoEditado == obj.id
                                    ? (state: any) => (
                                        <Save
                                          color={
                                            state.hovered ? "#fff" : "#000"
                                          }
                                          size={16}
                                        />
                                      )
                                    : (state: any) => (
                                        <Pencil
                                          color={
                                            state.hovered ? "#fff" : "#000"
                                          }
                                          size={16}
                                        />
                                      )}
                                </Pressable>

                                {/* BOTAO DELETAR/CANCELAR EDICAO OBJETIVO */}
                                <Pressable
                                  style={(state: any) => [
                                    globalStyles.secondaryButton,
                                    {
                                      paddingVertical: 8,
                                      width: 40,
                                      height: 32,
                                      backgroundColor: state.hovered
                                        ? "#ef4444"
                                        : "#fff",
                                      transitionProperty: "background-color",
                                      transitionDuration: "200ms",
                                      transitionTimingFunction: "ease-in-out",
                                    },
                                  ]}
                                  onPress={() => {
                                    if (objetivoEstaSendoEditado) {
                                      setIdObjetivoSendoEditado(0);
                                    } else {
                                      handleDeleteObjetivo(obj.id);
                                    }
                                  }}
                                >
                                  {objetivoEstaSendoEditado
                                    ? (state: any) => (
                                        <CircleX
                                          color={
                                            state.hovered ? "#fff" : "#000"
                                          }
                                          size={16}
                                        />
                                      )
                                    : (state: any) => (
                                        <Trash2
                                          color={
                                            state.hovered ? "#fff" : "#000"
                                          }
                                          size={16}
                                        />
                                      )}
                                </Pressable>

                                {objetivoAberto ? (
                                  <Pressable
                                    style={(state: any) => [
                                      globalStyles.secondaryButton,
                                      {
                                        width: 40,
                                        height: 32,
                                        paddingHorizontal: 0,
                                        backgroundColor: state.hovered
                                          ? "#c9cccf"
                                          : "#fff",
                                        transitionProperty: "background-color",
                                        transitionDuration: "200ms",
                                        transitionTimingFunction: "ease-in-out",
                                        overflow: "hidden",
                                      },
                                    ]}
                                    onPress={() => toggleAbrirObjetivo(obj.id)}
                                  >
                                    <ChevronUp color={"black"} />
                                  </Pressable>
                                ) : (
                                  <Pressable
                                    style={(state: any) => [
                                      globalStyles.secondaryButton,
                                      {
                                        width: 40,
                                        height: 32,
                                        paddingHorizontal: 0,
                                        backgroundColor: state.hovered
                                          ? "#c9cccf"
                                          : "#fff",
                                        transitionProperty: "background-color",
                                        transitionDuration: "200ms",
                                        transitionTimingFunction: "ease-in-out",
                                        overflow: "hidden",
                                      },
                                    ]}
                                    onPress={() => toggleAbrirObjetivo(obj.id)}
                                  >
                                    <ChevronDown color={"black"} />
                                  </Pressable>
                                )}
                              </View>
                            </Pressable>
                          </>
                        ) : (
                          <Pressable // OBJETIVO ROW
                            key={obj.id}
                            style={(state: any) => [
                              state.hovered && { backgroundColor: "#F1F5F9" },
                              styles.objetivoRow,
                              {
                                flexDirection: "column",
                                transitionProperty: "background-color",
                                transitionDuration: "200ms",
                                transitionTimingFunction: "ease-in-out",
                                gap: 20,
                              },
                              objetivoEstaSendoEditado && {
                                cursor: "default",
                                flexDirection: "column",
                                borderColor: "rgba(61, 132, 246, 0.41)",
                                borderStyle: "dashed",
                                borderWidth: 2,
                              },
                            ]}
                            onPress={() => {
                              // BOTAO CONCLUIR OBJETIVO
                              if (!objetivoEstaSendoEditado)
                                toggleObjetivo(etapa.id, obj.id);
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                width: "100%",
                              }}
                            >
                              {/* OBJETIVO */}
                              {objetivoEstaSendoEditado ? (
                                // FIX ME: EDITANDO OBJETIVO
                                <View
                                  style={{
                                    flex: 1,
                                    gap: 20,
                                    paddingHorizontal: 12,
                                    paddingTop: 12,
                                  }}
                                >
                                  <View style={{ gap: 4 }}>
                                    <Text style={styles.objetivoEditLabel}>
                                      Título:
                                    </Text>
                                    <TextInput
                                      style={[
                                        globalStyles.input,
                                        {
                                          flex: 1,
                                          backgroundColor: "white",
                                          color: "black",
                                        },
                                      ]}
                                      value={objetivoTituloEditInput}
                                    />
                                  </View>

                                  <View style={{ gap: 4 }}>
                                    <Text style={styles.objetivoEditLabel}>
                                      Descrição (opcional):
                                    </Text>
                                    <TextInput
                                      style={[
                                        globalStyles.input,
                                        {
                                          flex: 1,
                                          backgroundColor: "white",
                                          color: "black",
                                        },
                                      ]}
                                      value={objetivoDescricaoEditInput}
                                    />
                                  </View>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    gap: 8,
                                  }}
                                >
                                  <View style={styles.check}>
                                    {obj.concluido && (
                                      <Check
                                        color={colors.lightBlue}
                                        style={{ backgroundColor: "white" }}
                                      />
                                    )}
                                  </View>
                                  <View style={{ gap: 4 }}>
                                    <Text style={styles.objetivoTituloText}>
                                      {obj.titulo}
                                    </Text>
                                    <Text style={styles.objetivoDescricaoText}>
                                      {obj.descricao}
                                    </Text>
                                  </View>
                                </View>
                              )}

                              {/* ROW BOTAO EDITAR/EXCLUIR */}
                              {!objetivoEstaSendoEditado && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    gap: 8,
                                    marginLeft: 8,
                                    justifyContent: "flex-end",
                                    marginRight: 8,
                                    alignSelf: "flex-end",
                                  }}
                                >
                                  {/* BOTAO EDITAR OBJETIVO */}
                                  <Pressable
                                    style={(state: any) => [
                                      globalStyles.secondaryButton,
                                      {
                                        paddingVertical: 8,
                                        width: 40,
                                        height: 32,
                                        backgroundColor: state.hovered
                                          ? colors.lightBlue
                                          : "#fff",
                                        transitionProperty: "background-color",
                                        transitionDuration: "200ms",
                                        transitionTimingFunction: "ease-in-out",
                                      },
                                    ]}
                                    onPress={() => {
                                      setIdObjetivoSendoEditado(obj.id);
                                      setObjetivoTituloEditInput(obj.titulo);
                                      setObjetivoDescricaoEditInput(
                                        obj.descricao,
                                      );
                                    }}
                                  >
                                    {(state: any) => (
                                      <Pencil
                                        color={state.hovered ? "#fff" : "#000"}
                                        size={16}
                                      />
                                    )}
                                  </Pressable>

                                  {/* BOTAO DELETAR OBJETIVO */}
                                  <Pressable
                                    style={(state: any) => [
                                      globalStyles.secondaryButton,
                                      {
                                        paddingVertical: 8,
                                        width: 40,
                                        height: 32,
                                        backgroundColor: state.hovered
                                          ? "#ef4444"
                                          : "#fff",
                                        transitionProperty: "background-color",
                                        transitionDuration: "200ms",
                                        transitionTimingFunction: "ease-in-out",
                                      },
                                    ]}
                                    onPress={() => {
                                      handleDeleteObjetivo(obj.id);
                                    }}
                                  >
                                    {(state: any) => (
                                      <Trash2
                                        color={state.hovered ? "#fff" : "#000"}
                                        size={16}
                                      />
                                    )}
                                  </Pressable>

                                  {objetivoAberto ? (
                                    <Pressable
                                      style={(state: any) => [
                                        globalStyles.secondaryButton,
                                        {
                                          width: 40,
                                          height: 32,
                                          paddingHorizontal: 0,
                                          backgroundColor: state.hovered
                                            ? "#c9cccf"
                                            : "#fff",
                                          transitionProperty:
                                            "background-color",
                                          transitionDuration: "200ms",
                                          transitionTimingFunction:
                                            "ease-in-out",
                                          overflow: "hidden",
                                        },
                                      ]}
                                      onPress={() =>
                                        toggleAbrirObjetivo(obj.id)
                                      }
                                    >
                                      <ChevronUp color={"black"} />
                                    </Pressable>
                                  ) : (
                                    <Pressable
                                      style={(state: any) => [
                                        globalStyles.secondaryButton,
                                        {
                                          width: 40,
                                          height: 32,
                                          paddingHorizontal: 0,
                                          backgroundColor: state.hovered
                                            ? "#c9cccf"
                                            : "#fff",
                                          transitionProperty:
                                            "background-color",
                                          transitionDuration: "200ms",
                                          transitionTimingFunction:
                                            "ease-in-out",
                                          overflow: "hidden",
                                        },
                                      ]}
                                      onPress={() =>
                                        toggleAbrirObjetivo(obj.id)
                                      }
                                    >
                                      <ChevronDown color={"black"} />
                                    </Pressable>
                                  )}
                                </View>
                              )}
                            </View>

                            {/* ROW BOTAO SALVAR/CANCELAR */}
                            {objetivoEstaSendoEditado && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  gap: 8,
                                  marginLeft: 8,
                                  justifyContent: "flex-end",
                                  marginRight: 8,
                                  alignSelf: "flex-end",
                                }}
                              >
                                {/* BOTAO SALVAR EDICAO OBJETIVO */}
                                <Pressable
                                  style={(state: any) => [
                                    globalStyles.secondaryButton,
                                    {
                                      paddingVertical: 8,
                                      width: 40,
                                      height: 32,
                                      backgroundColor: state.hovered
                                        ? colors.green
                                        : "#fff",
                                      transitionProperty: "background-color",
                                      transitionDuration: "200ms",
                                      transitionTimingFunction: "ease-in-out",
                                    },
                                  ]}
                                  onPress={() => {
                                    // FIX ME: ADCIONAR FUNCAO DE EDITAR OBJETIVO
                                    setIdObjetivoSendoEditado(0);
                                  }}
                                >
                                  {(state: any) => (
                                    <Save
                                      color={state.hovered ? "#fff" : "#000"}
                                      size={16}
                                    />
                                  )}
                                </Pressable>

                                {/* BOTAO CANCELAR EDICAO OBJETIVO */}
                                <Pressable
                                  style={(state: any) => [
                                    globalStyles.secondaryButton,
                                    {
                                      paddingVertical: 8,
                                      width: 40,
                                      height: 32,
                                      backgroundColor: state.hovered
                                        ? "#ef4444"
                                        : "#fff",
                                      transitionProperty: "background-color",
                                      transitionDuration: "200ms",
                                      transitionTimingFunction: "ease-in-out",
                                    },
                                  ]}
                                  onPress={() => {
                                    setIdObjetivoSendoEditado(0);
                                  }}
                                >
                                  {(state: any) => (
                                    <CircleX
                                      color={state.hovered ? "#fff" : "#000"}
                                      size={16}
                                    />
                                  )}
                                </Pressable>

                                {/* BOTAO ABRIR/FECHAR OBJETIVO */}
                                {objetivoAberto ? (
                                  <Pressable
                                    style={(state: any) => [
                                      globalStyles.secondaryButton,
                                      {
                                        width: 40,
                                        height: 32,
                                        paddingHorizontal: 0,
                                        backgroundColor: state.hovered
                                          ? "#c9cccf"
                                          : "#fff",
                                        transitionProperty: "background-color",
                                        transitionDuration: "200ms",
                                        transitionTimingFunction: "ease-in-out",
                                        overflow: "hidden",
                                      },
                                    ]}
                                    onPress={() => toggleAbrirObjetivo(obj.id)}
                                  >
                                    <ChevronUp color={"black"} />
                                  </Pressable>
                                ) : (
                                  <Pressable
                                    style={(state: any) => [
                                      globalStyles.secondaryButton,
                                      {
                                        width: 40,
                                        height: 32,
                                        paddingHorizontal: 0,
                                        backgroundColor: state.hovered
                                          ? "#c9cccf"
                                          : "#fff",
                                        transitionProperty: "background-color",
                                        transitionDuration: "200ms",
                                        transitionTimingFunction: "ease-in-out",
                                        overflow: "hidden",
                                      },
                                    ]}
                                    onPress={() => toggleAbrirObjetivo(obj.id)}
                                  >
                                    <ChevronDown color={"black"} />
                                  </Pressable>
                                )}
                              </View>
                            )}
                          </Pressable>
                        );